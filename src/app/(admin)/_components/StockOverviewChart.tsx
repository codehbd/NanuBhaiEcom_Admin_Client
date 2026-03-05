"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { TStockProduct } from "@/types/order";
import { use } from "react";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const LOW_STOCK_THRESHOLD = 10;

function formatCurrency(val: number) {
  return `৳${val.toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function StockOverviewChart({
  lowStockProducts,
}: {
  lowStockProducts?: Promise<TStockProduct[]>;
}) {
  const products = use(lowStockProducts ?? Promise.resolve([]));

  // Calculations per product
  const enriched = products.map((p) => {
    const stockVal =
      typeof p.stockValue === "number" && p.stockValue > 0
        ? p.stockValue
        : p.stock * p.price;
    const buyingCostTotal =
      p.buyingPrice != null ? p.stock * p.buyingPrice : null;
    const potentialRevenue = p.stock * p.price;
    const potentialProfit =
      buyingCostTotal != null ? potentialRevenue - buyingCostTotal : null;
    const isUrgent = p.stock <= LOW_STOCK_THRESHOLD;
    return { ...p, stockVal, buyingCostTotal, potentialRevenue, potentialProfit, isUrgent };
  });

  // Sort: most critical (lowest stock) first
  const sorted = [...enriched].sort((a, b) => a.stock - b.stock);

  const names = sorted.map((p) =>
    p.name.length > 20 ? p.name.slice(0, 18) + "…" : p.name
  );
  const stockQtys = sorted.map((p) => p.stock);
  const barColors = sorted.map((p) =>
    p.stock === 0 ? "#EF4444" : p.stock <= 5 ? "#F97316" : "#F43F5E"
  );

  // Summary stats
  const totalStockValue = enriched.reduce((s, p) => s + p.stockVal, 0);
  const outOfStock = enriched.filter((p) => p.stock === 0).length;
  const critical = enriched.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const warning = enriched.filter((p) => p.stock > 5 && p.stock <= LOW_STOCK_THRESHOLD).length;

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      animations: { enabled: true, speed: 700 },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        barHeight: "55%",
        distributed: true,
      },
    },
    colors: barColors,
    dataLabels: {
      enabled: true,
      formatter: (val: number, { dataPointIndex }) => {
        const p = sorted[dataPointIndex];
        return p
          ? `${val} pcs │ ৳${p.price.toLocaleString("en-BD")}`
          : `${val} pcs`;
      },
      style: { fontSize: "11px", colors: ["#111827"], fontWeight: 500 },
    },
    xaxis: {
      categories: names,
      title: {
        text: "Stock Quantity (pcs)",
        style: { color: "#6B7280", fontWeight: 500, fontSize: "12px" },
      },
      labels: { style: { colors: "#6B7280", fontSize: "11px" } },
    },
    yaxis: {
      labels: { style: { colors: "#6B7280", fontSize: "11px" } },
    },
    legend: { show: false },
    grid: { borderColor: "#E5E7EB", strokeDashArray: 4 },
    tooltip: {
      custom: ({ dataPointIndex }) => {
        const p = sorted[dataPointIndex];
        if (!p) return "";
        const profitLine =
          p.potentialProfit != null
            ? `<div style="margin-top:4px">Potential Profit: <b style="color:${p.potentialProfit >= 0 ? "#16a34a" : "#dc2626"}">৳${p.potentialProfit.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</b></div>`
            : "";
        return `
          <div style="padding:10px 14px;font-family:Outfit,sans-serif;font-size:13px;line-height:1.6">
            <b>${p.name}</b>
            <div>Stock: <b>${p.stock} pcs</b></div>
            <div>Selling Price: <b>৳${p.price.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</b></div>
            ${p.buyingPrice != null ? `<div>Buying Price: <b>৳${p.buyingPrice.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</b></div>` : ""}
            <div>Stock Value: <b>৳${p.stockVal.toLocaleString("en-BD", { minimumFractionDigits: 2 })}</b></div>
            <div>Units Sold: <b>${p.sold ?? 0}</b></div>
            ${profitLine}
            <div style="margin-top:4px">Status: <b style="color:${
              p.stock === 0 ? "#EF4444" : p.stock <= 5 ? "#F97316" : "#F59E0B"
            }">${p.stock === 0 ? "❌ Out of Stock" : p.stock <= 5 ? "🔴 Critical" : "⚠️ Low Stock"}</b></div>
          </div>
        `;
      },
    },
  };

  const series = [{ name: "Stock", data: stockQtys }];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Low Stock Products
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Products with stock ≤ {LOW_STOCK_THRESHOLD} units
          </p>
        </div>
        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-3 py-1 rounded-full font-medium">
          {products.length} product{products.length !== 1 ? "s" : ""} at risk
        </span>
      </div>

      {products.length > 0 ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="rounded-xl p-3 bg-red-50 dark:bg-red-900/20 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Out of Stock
              </span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {outOfStock}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                stock = 0
              </span>
            </div>
            <div className="rounded-xl p-3 bg-orange-50 dark:bg-orange-900/20 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Critical
              </span>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {critical}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                1–5 units left
              </span>
            </div>
            <div className="rounded-xl p-3 bg-yellow-50 dark:bg-yellow-900/20 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Low Warning
              </span>
              <span className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {warning}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                6–{LOW_STOCK_THRESHOLD} units
              </span>
            </div>
            <div className="rounded-xl p-3 bg-blue-50 dark:bg-blue-900/20 flex flex-col gap-1">
              <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Total Stock Value
              </span>
              <span className="text-base font-bold text-blue-600 dark:text-blue-400 leading-tight">
                {formatCurrency(totalStockValue)}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                across at-risk products
              </span>
            </div>
          </div>

          {/* Chart */}
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={Math.max(300, sorted.length * 46)}
          />

          {/* Product Detail Table */}
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400">Product</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-right">Stock</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-right">Selling</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-right">Buying</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-right">Stock Value</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-right">Sold</th>
                  <th className="pb-2 font-semibold text-gray-500 dark:text-gray-400 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-2 pr-4 font-medium text-gray-800 dark:text-white/90 max-w-[140px] truncate">
                      {p.name}
                    </td>
                    <td className="py-2 text-right font-bold text-gray-700 dark:text-gray-300">
                      {p.stock}
                    </td>
                    <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-2 text-right text-gray-600 dark:text-gray-400">
                      {p.buyingPrice != null
                        ? formatCurrency(p.buyingPrice)
                        : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="py-2 text-right text-blue-600 dark:text-blue-400 font-medium">
                      {formatCurrency(p.stockVal)}
                    </td>
                    <td className="py-2 text-right text-gray-500 dark:text-gray-400">
                      {p.sold ?? 0}
                    </td>
                    <td className="py-2 text-center">
                      {p.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-medium">
                          Out of Stock
                        </span>
                      ) : p.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 font-medium">
                          Critical
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium">
                          Low
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              Out of Stock (0 units)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              Critical (1–5 units)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Low (6–{LOW_STOCK_THRESHOLD} units)
            </span>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400 dark:text-gray-600">
          <span className="text-4xl mb-3">✅</span>
          <p className="text-sm font-medium">All products are well stocked!</p>
          <p className="text-xs mt-1">No products below {LOW_STOCK_THRESHOLD} units.</p>
        </div>
      )}
    </div>
  );
}

export function StockOverviewChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="h-5 w-44 rounded-md bg-gray-200 dark:bg-white/10 mb-1"></div>
          <div className="h-3 w-52 rounded-md bg-gray-100 dark:bg-white/5"></div>
        </div>
        <div className="h-6 w-28 rounded-full bg-gray-100 dark:bg-white/5"></div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="rounded-xl p-3 bg-gray-100 dark:bg-white/5 flex flex-col gap-2">
            <div className="h-2.5 w-16 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="h-6 w-10 rounded bg-gray-200 dark:bg-white/10"></div>
            <div className="h-2 w-20 rounded bg-gray-100 dark:bg-white/5"></div>
          </div>
        ))}
      </div>

      {/* Chart bars */}
      <div className="space-y-3">
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="h-4 w-28 rounded-md bg-gray-200 dark:bg-white/10"></div>
            <div
              className="h-7 rounded-md bg-gray-200 dark:bg-white/10"
              style={{ width: `${[70, 55, 45, 35, 25][idx]}%` }}
            ></div>
          </div>
        ))}
      </div>

      {/* Table placeholder */}
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-gray-100 dark:bg-white/5"></div>
        {[...Array(5)].map((_, idx) => (
          <div key={idx} className="h-8 w-full rounded bg-gray-100 dark:bg-white/5"></div>
        ))}
      </div>
    </div>
  );
}

