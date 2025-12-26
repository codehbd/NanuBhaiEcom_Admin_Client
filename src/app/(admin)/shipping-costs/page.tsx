import { Metadata } from "next";
import { Suspense } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ShippingCostTableBody from "./_components/ShippingCostTableBody";
import CreateShipping from "./_components/CreateShipping";

export const metadata: Metadata = {
  title: "Shipping Cost List | Nanuvaier Rosona Kothon - Your Online Shop",
  description: "An online store for all your needs",
};
const headers: string[] = ["Division", "Cost", "Actions"];
function LoadingSkeleton() {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse h-[72px]">
          {/* Division */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Cost */}
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

export default async function ShippingCostPage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Shipping Cost List" />
      <CreateShipping />
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
                <ShippingCostTableBody headers={headers} />
              </Suspense>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
