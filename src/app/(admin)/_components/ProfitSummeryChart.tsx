"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { use } from "react";
import { TProfitSummery } from "@/types/order";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function formatCurrency(val: number) {
  return `৳${val.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProfitSummeryChart({
  summary,
}: {
  summary: Promise<TProfitSummery>;
}) {
  const data = use(summary);

  const {
    totalGross,
    totalNet,
    totalOrders,
    profit,
    margin,
    totalBuyingCost = 0,
    totalSellingPrice = 0,
  } = data ?? {};

  // Recalculate profit from selling price vs buying cost if available
  const computedProfit =
    totalBuyingCost > 0 ? totalNet - totalBuyingCost : profit;
  const computedMargin =
    totalBuyingCost > 0 && totalNet > 0
      ? parseFloat(((computedProfit / totalNet) * 100).toFixed(2))
      : margin;

  // Summary cards
  const summaryCards = [
    {
      label: "Gross Revenue",
      value: formatCurrency(totalGross),
      sub: "Before discounts & shipping",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      label: "Net Revenue",
      value: formatCurrency(totalNet),
      sub: "After discounts & shipping",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
    },
    ...(totalBuyingCost > 0
      ? [
          {
            label: "Buying Cost",
            value: formatCurrency(totalBuyingCost),
            sub: "Total cost of goods sold",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-900/20",
          },
        ]
      : []),
    {
      label: "Net Profit",
      value: formatCurrency(computedProfit),
      sub:
        totalBuyingCost > 0
          ? "Net Revenue − Buying Cost"
          : "Calculated by server",
      color:
        computedProfit >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
      bg:
        computedProfit >= 0
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Profit Margin",
      value: `${computedMargin.toFixed(2)}%`,
      sub: "Profit / Net Revenue × 100",
      color:
        computedMargin >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
      bg:
        computedMargin >= 0
          ? "bg-green-50 dark:bg-green-900/20"
          : "bg-red-50 dark:bg-red-900/20",
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      sub: "Completed orders",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
  ];

  // Chart: compare Revenue vs Buying Cost vs Profit
  const chartCategories =
    totalBuyingCost > 0
      ? ["Gross", "Net Revenue", "Buying Cost", "Net Profit"]
      : ["Gross", "Net Revenue", "Net Profit"];

  const chartValues =
    totalBuyingCost > 0
      ? [totalGross, totalNet, totalBuyingCost, computedProfit]
      : [totalGross, totalNet, computedProfit];

  const chartColors = chartValues.map((val, idx) => {
    if (totalBuyingCost > 0) {
      if (idx === 2) return "#FF9F40"; // Buying Cost - orange
      if (idx === 3) return val >= 0 ? "#00E396" : "#FF4560"; // Profit
    } else {
      if (idx === 2) return val >= 0 ? "#00E396" : "#FF4560"; // Profit
    }
    return "#465fff";
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "50%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) =>
        val >= 1000
          ? `৳${(val / 1000).toFixed(1)}k`
          : val < 0
          ? `-৳${Math.abs(val).toFixed(0)}`
          : `৳${val.toFixed(0)}`,
      style: { fontSize: "11px", colors: ["#fff"] },
    },
    xaxis: {
      categories: chartCategories,
      labels: {
        style: { fontSize: "12px", colors: "#888" },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 1000
            ? `৳${(val / 1000).toFixed(0)}k`
            : `৳${val.toFixed(0)}`,
        style: { fontSize: "11px" },
      },
    },
    legend: { show: false },
    grid: { yaxis: { lines: { show: true } } },
    colors: chartColors,
    tooltip: {
      y: {
        formatter: (val) => formatCurrency(val),
      },
    },
  };

  const series = [
    {
      name: "Amount (৳)",
      data: chartValues,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Profit Summary
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Based on product selling price vs buying price
          </p>
        </div>
        {totalBuyingCost > 0 && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full font-medium">
            Buying Price Tracked
          </span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl p-3 ${card.bg} flex flex-col gap-1`}
          >
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              {card.label}
            </span>
            <span className={`text-base font-bold ${card.color} leading-tight`}>
              {card.value}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">
              {card.sub}
            </span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={280}
      />

      {/* Profit Formula */}
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
        <span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Gross
          </span>{" "}
          = Total order amounts before deductions
        </span>
        <span>
          <span className="font-semibold text-gray-700 dark:text-gray-300">
            Net
          </span>{" "}
          = Gross − Discounts + Shipping
        </span>
        {totalBuyingCost > 0 && (
          <span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              Profit
            </span>{" "}
            = Net Revenue − Buying Cost
          </span>
        )}
      </div>
    </div>
  );
}
export function ProfitSummeryChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-5 w-40 rounded-md bg-gray-200 dark:bg-white/10 mb-1"></div>
          <div className="h-3 w-56 rounded-md bg-gray-100 dark:bg-white/5"></div>
        </div>
        <div className="h-6 w-32 rounded-full bg-gray-100 dark:bg-white/5"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="rounded-xl p-3 bg-gray-100 dark:bg-white/5 flex flex-col gap-2">
            <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="h-5 w-20 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="h-2 w-24 rounded bg-gray-100 dark:bg-white/5"></div>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="flex justify-between h-[280px] items-end px-4">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="w-16 bg-gray-200 dark:bg-white/10 rounded-md"
            style={{ height: `${[60, 50, 40, 35][idx]}%` }}
          />
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 px-4">
        {["Gross", "Net Revenue", "Buying Cost", "Net Profit"].map((label, idx) => (
          <div key={idx} className="h-3 w-14 rounded-md bg-gray-200 dark:bg-white/10"></div>
        ))}
      </div>
    </div>
  );
}
