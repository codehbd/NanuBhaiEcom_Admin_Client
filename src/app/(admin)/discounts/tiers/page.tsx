import { Metadata } from "next";
import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import CreateTier from "./_components/CreateTier";
import TiersTableBody from "./_components/TiersTableBody";

export const metadata: Metadata = {
  title: "Discount-Tiers | Nanuvaier Rosona Kothon - Your Online Shop",
  description: "An online store for all your needs",
};
const headers: string[] = ["Min", "Value", "Actions"];
function LoadingSkeleton() {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse h-[72px]">
          {/* Min */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Value */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Actions */}
          <td className="px-5 py-4 sm:px-6">
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}

export default async function AttributesPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Discount Tiers" />
      <CreateTier />
      <div className="mt-4 w-full overflow-x-auto">
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
                <TiersTableBody headers={headers} />
              </Suspense>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
