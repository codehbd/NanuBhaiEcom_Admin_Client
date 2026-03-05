"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { use } from "react";
import { TMonthlySale } from "@/types/order";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ALL_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

interface MonthlySalesProp {
  data: TMonthlySale[];
  year: number;
}

function formatCurrency(val: number) {
  return `৳${val.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MonthlySalesChart({
  monthlySales,
}: {
  monthlySales: Promise<MonthlySalesProp>;
}) {
  const { data, year } = use(monthlySales);

  // Build a month-keyed map for quick lookup
  const salesMap = new Map<string, TMonthlySale>();
  data.forEach((d) => salesMap.set(d.month, d));

  // Fill all 12 months (0 for missing)
  const filled = ALL_MONTHS.map((m) => ({
    month: m,
    totalSales: salesMap.get(m)?.totalSales ?? 0,
    totalOrders: salesMap.get(m)?.totalOrders ?? 0,
    totalDiscount: salesMap.get(m)?.totalDiscount ?? 0,
    totalShipping: salesMap.get(m)?.totalShipping ?? 0,
    totalNet:
      salesMap.get(m)?.totalNet ??
      (salesMap.get(m)
        ? (salesMap.get(m)!.totalSales -
            (salesMap.get(m)!.totalDiscount ?? 0) +
            (salesMap.get(m)!.totalShipping ?? 0))
        : 0),
  }));

  // Aggregate stats
  const totalAnnualSales = filled.reduce((s, m) => s + m.totalSales, 0);
  const totalAnnualOrders = filled.reduce((s, m) => s + m.totalOrders, 0);
  const totalAnnualNet = filled.reduce((s, m) => s + m.totalNet, 0);
  const totalAnnualDiscount = filled.reduce((s, m) => s + m.totalDiscount, 0);
  const avgOrderValue =
    totalAnnualOrders > 0
      ? totalAnnualSales / totalAnnualOrders
      : 0;

  // Best month by sales
  const bestMonth = filled.reduce(
    (best, m) => (m.totalSales > best.totalSales ? m : best),
    filled[0]
  );

  // Current month (index 0-based)
  const currentMonthIdx = new Date().getFullYear() === year
    ? new Date().getMonth()
    : -1;
  const currentMonthData = currentMonthIdx >= 0 ? filled[currentMonthIdx] : null;

  const options: ApexOptions = {
    colors: ["#465fff", "#00E396", "#FF9F40"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
    },
    stroke: {
      width: [0, 3, 2],
      dashArray: [0, 0, 4],
    },
    plotOptions: {
      bar: { columnWidth: "38%", borderRadius: 5 },
    },
    dataLabels: { enabled: false },
    labels: ALL_MONTHS,
    xaxis: {
      type: "category",
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#9CA3AF", fontSize: "12px" } },
    },
    yaxis: [
      {
        seriesName: "Gross Sales",
        title: {
          text: "Revenue (৳)",
          style: { color: "#6B7280", fontSize: "11px" },
        },
        labels: {
          formatter: (v) =>
            v >= 1000 ? `৳${(v / 1000).toFixed(0)}k` : `৳${v.toFixed(0)}`,
          style: { colors: "#6B7280", fontSize: "11px" },
        },
      },
      {
        seriesName: "Net Revenue",
        show: false, // shares left axis scale
      },
      {
        opposite: true,
        seriesName: "Orders",
        title: {
          text: "Orders",
          style: { color: "#6B7280", fontSize: "11px" },
        },
        labels: {
          formatter: (v) => `${v.toFixed(0)}`,
          style: { colors: "#6B7280", fontSize: "11px" },
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: [
        { formatter: (v) => formatCurrency(v) },
        { formatter: (v) => formatCurrency(v) },
        { formatter: (v) => `${v} orders` },
      ],
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
      fontSize: "13px",
      markers: { size: 8 },
    },
    grid: {
      borderColor: "#F3F4F6",
      yaxis: { lines: { show: true } },
    },
    // Highlight current month
    ...(currentMonthIdx >= 0 && {
      annotations: {
        xaxis: [
          {
            x: ALL_MONTHS[currentMonthIdx],
            borderColor: "#465fff",
            borderWidth: 1,
            strokeDashArray: 3,
            label: {
              text: "This Month",
              style: { color: "#fff", background: "#465fff", fontSize: "10px" },
            },
          },
        ],
      },
    }),
  };

  const series = [
    {
      name: "Gross Sales",
      type: "column" as const,
      data: filled.map((m) => m.totalSales),
    },
    {
      name: "Net Revenue",
      type: "line" as const,
      data: filled.map((m) => m.totalNet),
    },
    {
      name: "Orders",
      type: "line" as const,
      data: filled.map((m) => m.totalOrders),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Sales
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {year} — Gross vs Net revenue & order volume
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-900/20 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Annual Gross
          </span>
          <span className="text-base font-bold text-blue-600 dark:text-blue-400 leading-tight">
            {formatCurrency(totalAnnualSales)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Total sales {year}
          </span>
        </div>
        <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-900/20 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Net Revenue
          </span>
          <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
            {formatCurrency(totalAnnualNet)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            After discounts
          </span>
        </div>
        <div className="rounded-xl p-3 bg-purple-50 dark:bg-purple-900/20 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Total Orders
          </span>
          <span className="text-base font-bold text-purple-600 dark:text-purple-400 leading-tight">
            {totalAnnualOrders.toLocaleString()}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            All orders {year}
          </span>
        </div>
        <div className="rounded-xl p-3 bg-orange-50 dark:bg-orange-900/20 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Avg Order Value
          </span>
          <span className="text-base font-bold text-orange-600 dark:text-orange-400 leading-tight">
            {formatCurrency(avgOrderValue)}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            Gross ÷ Orders
          </span>
        </div>
        <div className="rounded-xl p-3 bg-yellow-50 dark:bg-yellow-900/20 flex flex-col gap-1">
          <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Best Month
          </span>
          <span className="text-base font-bold text-yellow-600 dark:text-yellow-400 leading-tight">
            {bestMonth.totalSales > 0 ? bestMonth.month : "—"}
          </span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500">
            {bestMonth.totalSales > 0
              ? formatCurrency(bestMonth.totalSales)
              : "No data yet"}
          </span>
        </div>
      </div>

      {/* Current Month Highlight */}
      {currentMonthData && currentMonthData.totalOrders > 0 && (
        <div className="flex flex-wrap gap-4 mb-4 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            {ALL_MONTHS[currentMonthIdx!]} {year}:
          </span>
          <span>Gross: <b className="text-gray-800 dark:text-white">{formatCurrency(currentMonthData.totalSales)}</b></span>
          <span>Net: <b className="text-gray-800 dark:text-white">{formatCurrency(currentMonthData.totalNet)}</b></span>
          <span>Orders: <b className="text-gray-800 dark:text-white">{currentMonthData.totalOrders}</b></span>
          {currentMonthData.totalDiscount > 0 && (
            <span>Discounts: <b className="text-red-500">{formatCurrency(currentMonthData.totalDiscount)}</b></span>
          )}
          {totalAnnualOrders > 0 && (
            <span>Share: <b className="text-blue-600 dark:text-blue-400">{((currentMonthData.totalOrders / totalAnnualOrders) * 100).toFixed(1)}%</b> of annual orders</span>
          )}
        </div>
      )}

      {/* Chart */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={280}
          />
        </div>
      </div>

      {/* Discount & Shipping Summary Footer */}
      {(totalAnnualDiscount > 0) && (
        <div className="flex flex-wrap gap-4 border-t border-gray-100 dark:border-gray-700 pt-3 pb-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Total Discounts Given:</span>{" "}
            <span className="text-red-500 font-medium">{formatCurrency(totalAnnualDiscount)}</span>
          </span>
          <span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Net vs Gross:</span>{" "}
            <span className={totalAnnualNet >= totalAnnualSales ? "text-green-600" : "text-orange-500"}>
              {totalAnnualSales > 0
                ? `${((totalAnnualNet / totalAnnualSales) * 100).toFixed(1)}% retention`
                : "—"}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

export function MonthlySalesChartSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="h-5 w-40 rounded-md bg-gray-200 dark:bg-white/10 mb-1" />
          <div className="h-3 w-56 rounded-md bg-gray-100 dark:bg-white/5" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="rounded-xl p-3 bg-gray-100 dark:bg-white/5 flex flex-col gap-2">
            <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-5 w-24 rounded bg-gray-200 dark:bg-white/10" />
            <div className="h-2 w-20 rounded bg-gray-100 dark:bg-white/5" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <div className="h-[280px] rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pb-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-white/10" />
            <div className="h-3 w-20 rounded-md bg-gray-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
