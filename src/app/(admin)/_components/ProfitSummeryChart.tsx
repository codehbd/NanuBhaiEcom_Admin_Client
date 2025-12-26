"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { use } from "react";
import { TProfitSummery } from "@/types/order";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function ProfitSummeryChart({
  summary,
}: {
  summary: Promise<TProfitSummery>;
}) {
  const { totalGross, totalNet, totalOrders, profit, margin } = use(summary);
  // Labels in the same order as values
  const labels = ["Gross", "Net", "Orders", "Profit", "Margin (%)"];

  // Extract data in order
  const values = [totalGross, totalNet, totalOrders, profit, margin];

  // Assign color dynamically based on sign
  const colors = values.map((val, idx) => {
    if (idx === 3 || idx === 4) {
      // Profit or Margin
      return val >= 0 ? "#00E396" : "#FF4560"; // green or red
    }
    return "#465fff"; // default blue for others
  });

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 250,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "45%",
        distributed: true, // enable per-bar colors
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: "13px",
          colors: "#888",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val) => val.toFixed(0),
      },
    },
    grid: { yaxis: { lines: { show: true } } },
    colors,
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  };

  const series = [
    {
      name: "Summary",
      data: values,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
        Profit Summery
      </h3>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={250}
      />
    </div>
  );
}
export function ProfitSummeryChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="h-5 w-40 rounded-md bg-gray-200 dark:bg-white/10 mb-4"></div>

      {/* Chart bars placeholder */}
      <div className="flex justify-between h-40 items-end">
        {[...Array(5)].map((_, idx) => (
          <div
            key={idx}
            className="w-8 bg-gray-200 dark:bg-white/10 rounded-md"
            style={{ height: `${Math.random() * 80 + 40}px` }} // random height for pulse effect
          />
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-3">
        {["Gross", "Net", "Orders", "Profit", "Margin"].map((label, idx) => (
          <div
            key={idx}
            className="h-3 w-10 rounded-md bg-gray-200 dark:bg-white/10"
          ></div>
        ))}
      </div>
    </div>
  );
}
