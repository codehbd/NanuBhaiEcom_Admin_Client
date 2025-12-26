import type { Metadata } from "next";
import React, { Suspense } from "react";
import MonthlySalesChart, {
  MonthlySalesChartSkeleton,
} from "@/app/(admin)/_components/MonthlySalesChart";
import {
  getMonthlySalesApi,
  getProfitSummeryApi,
  getStockOverviewApi,
} from "@/services/orderApi";
import { TMonthlySale, TProfitSummery, TStockProduct } from "@/types/order";

import ProfitSummeryChart, {
  ProfitSummeryChartSkeleton,
} from "./_components/ProfitSummeryChart";
import StockOverviewChart, {
  StockOverviewChartSkeleton,
} from "./_components/StockOverviewChart";

export const metadata: Metadata = {
  title: "Dashboard | NanuBhai",
  description: "An ecommerce platform",
};

async function fetchMonthlySales(): Promise<{
  data: TMonthlySale[];
  year: number;
}> {
  const data = await getMonthlySalesApi();
  return { data: data?.data, year: data?.year };
}
async function fetchProfitSummery(): Promise<TProfitSummery> {
  const data = await getProfitSummeryApi();
  return data?.summary;
}
async function fetchStockOverview(): Promise<TStockProduct[]> {
  const data = await getStockOverviewApi();
  return data?.lowStockProducts;
}

export default async function Ecommerce() {
  const monthlySales = fetchMonthlySales();
  const profitSummery = fetchProfitSummery();
  const stockOverview = fetchStockOverview();
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* <EcommerceMetrics /> */}
      </div>

      <div className="col-span-12 xl:col-span-5">{/* <MonthlyTarget /> */}</div>

      <div className="col-span-12">
        <Suspense fallback={<MonthlySalesChartSkeleton />}>
          <MonthlySalesChart monthlySales={monthlySales} />
        </Suspense>
      </div>
      <div className="col-span-12">
        <Suspense fallback={<ProfitSummeryChartSkeleton />}>
          <ProfitSummeryChart summary={profitSummery} />
        </Suspense>
      </div>

      <div className="col-span-12">
        <Suspense fallback={<StockOverviewChartSkeleton />}>
          <StockOverviewChart lowStockProducts={stockOverview} />
        </Suspense>
      </div>
      <div className="col-span-12">{/* <StatisticsChart /> */}</div>

      <div className="col-span-12 xl:col-span-5">
        {/* <DemographicCard /> */}
      </div>

      <div className="col-span-12 xl:col-span-7">{/* <RecentOrders /> */}</div>
    </div>
  );
}
