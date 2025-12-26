import { Metadata } from "next";
import { Suspense } from "react";
import BrandsTableBody from "./_components/BrandsTableBody";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";

export const metadata: Metadata = {
  title: "Brand List | Nanuvaier Rosona Kothon - Your Online Shop",
  description: "An online store for all your needs",
};

const headers: string[] = ["Brand Name", "Status", "Actions"];
function LoadingSkeleton() {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse h-[72px]">
          {/* Brand Name */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Status */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Actions */}
          <td className="px-5 py-4 sm:px-6">
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

type SearchParams = Promise<{ page?: number }>;

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page } = await searchParams;
  return (
    <>
      <PageBreadcrumb pageTitle="Brand List" />
      <ComponentCard title="Brands">
        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    {headers?.map((header, index) => (
                      <th
                        key={index}
                        className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <Suspense fallback={<LoadingSkeleton />}>
                  <BrandsTableBody page={page} colSpan={headers.length} />
                </Suspense>
              </table>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
