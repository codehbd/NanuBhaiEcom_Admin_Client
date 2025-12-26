"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TStockProduct } from "@/types/order";
import { use } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function StockOverviewChart({
  lowStockProducts,
}: {
  lowStockProducts?: Promise<TStockProduct[]>;
}) {
  const resolvedLowStockProducts = use(lowStockProducts ?? Promise.resolve([]));
  // No need to check for array, as Promise.resolve([]) always resolves to an array

  const lowStockNames = resolvedLowStockProducts.map((p) => p.name);
  const lowStockQty = resolvedLowStockProducts.map((p) => p.stock);
  const lowStockPrices = resolvedLowStockProducts.map((p) => p.price);

  const lowStockOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      animations: { enabled: true, speed: 700 },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        barHeight: "60%",
      },
    },
    colors: ["#F43F5E"],
    dataLabels: {
      enabled: true,
      formatter: (val, { dataPointIndex }) =>
        `${val} pcs | ৳${
          lowStockPrices[dataPointIndex]?.toLocaleString?.() ?? 0
        }`,
      style: { fontSize: "12px", colors: ["#111"], fontWeight: 500 },
    },
    xaxis: {
      categories: lowStockNames,
      title: {
        text: "Stock Quantity",
        style: { color: "#374151", fontWeight: 600 },
      },
      labels: { style: { colors: "#6B7280", fontSize: "12px" } },
    },
    tooltip: {
      y: {
        formatter: (val, { dataPointIndex }) => {
          const p = resolvedLowStockProducts[dataPointIndex];
          return p
            ? `${p.name}: ${val} pcs | ৳${p.price.toLocaleString?.()}`
            : `${val} pcs`;
        },
      },
    },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
  };

  const lowStockSeries = [{ name: "Low Stock", data: lowStockQty }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        ⚠️ Low Stock Products
      </h3>

      {resolvedLowStockProducts.length > 0 ? (
        <ReactApexChart
          options={lowStockOptions}
          series={lowStockSeries}
          type="bar"
          height={250}
        />
      ) : (
        <p className="text-gray-500 text-sm text-center py-10">
          No low-stock products to display.
        </p>
      )}
    </div>
  );
}

export function StockOverviewChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header placeholder */}
      <div className="h-5 w-48 rounded-md bg-gray-200 dark:bg-white/10 mb-4"></div>

      {/* Bars placeholder */}
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-white/10"></div>
            <div className="flex-1 h-4 rounded-md bg-gray-200 dark:bg-white/10"></div>
          </div>
        ))}
      </div>

      {/* Optional "no data" placeholder */}
      <div className="h-6 mt-4 rounded-md bg-gray-200 dark:bg-white/10 w-32 mx-auto"></div>
    </div>
  );
}
