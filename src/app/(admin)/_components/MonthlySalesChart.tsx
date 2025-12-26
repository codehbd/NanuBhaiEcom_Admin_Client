"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { MoreDotIcon } from "@/icons";
import { DropdownItem } from "../../../components/ui/dropdown/DropdownItem";
import { use, useState } from "react";
import { Dropdown } from "../../../components/ui/dropdown/Dropdown";
import { TMonthlySale } from "@/types/order";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface MonthlySalesProp {
  data: TMonthlySale[];
  year: number;
}

export default function MonthlySalesChart({
  monthlySales,
}: {
  monthlySales: Promise<MonthlySalesProp>;
}) {
  const { data, year } = use(monthlySales);

  const options: ApexOptions = {
    colors: ["#465fff", "#00E396"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "line",
      height: 180,
      toolbar: { show: false },
    },
    stroke: {
      width: [0, 3], // bar = 0px, line = 3px
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: true,
      enabledOnSeries: [1], // only show labels for line (orders)
    },
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    xaxis: {
      type: "category",
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: {
          text: "Total Sales ($)",
        },
      },
      {
        opposite: true,
        title: {
          text: "Total Orders",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Outfit",
    },
    grid: {
      yaxis: { lines: { show: true } },
    },
  };

  const series = [
    {
      name: "Total Sales",
      type: "column" as const,
      data: data.map((item) => item.totalSales),
    },
    {
      name: "Total Orders",
      type: "line" as const,
      data: data.map((item) => item.totalOrders),
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales ({year})
        </h3>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              View More
            </DropdownItem>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={250}
          />
        </div>
      </div>
    </div>
  );
}

export function MonthlySalesChartSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-40 rounded-md bg-gray-200 dark:bg-white/10" />
        <div className="h-5 w-5 rounded-md bg-gray-200 dark:bg-white/10" />
      </div>

      {/* Chart area */}
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
          <div className="h-[250px] rounded-xl bg-gray-200 dark:bg-white/10" />
        </div>
      </div>

      {/* Legend placeholder */}
      <div className="flex items-center gap-3 mt-4">
        <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-white/10"></div>
        <div className="h-3 w-24 rounded-md bg-gray-200 dark:bg-white/10"></div>
        <div className="h-3 w-3 rounded-full bg-gray-300 dark:bg-white/10 ml-6"></div>
        <div className="h-3 w-24 rounded-md bg-gray-200 dark:bg-white/10"></div>
      </div>
    </div>
  );
}
