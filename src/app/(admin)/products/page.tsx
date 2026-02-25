import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import { Suspense } from "react";
import ProductsTableBody from "./_components/ProductsTableBody";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";
import { TCategory } from "@/types/category";
import CategoryFilter from "./_components/CategoryFilter";
import Pagination from "@/components/Pagination";
import { getAllProductsApi } from "@/services/productApi";

export const metadata: Metadata = {
  title: "Product List | Nanuvaier Rosona Kothon - Your Online Shop",
  description: "An online store for all your needs",
};

function LoadingSkeleton() {
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse h-[72px]">
          {/* Image */}
          <td className="px-5 py-4 sm:px-6">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>
          {/* Product Name */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>
          {/* Category */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Status */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Price */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Featured / Regular */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
          </td>

          {/* Shipping */}
          <td className="px-5 py-4 sm:px-6">
            <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
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
const headers: string[] = [
  "Image",
  "Product Name",
  "Category",
  "Status",
  "Price",
  "Featured",
  "Shipping",
  "Actions",
];

const limit = 5;

type SearchParams = Promise<{ page?: number ,category?:string}>;

// Main component
async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}

async function fetchProductsTotal(page?: number, category?: string): Promise<number> {
  const data = await getAllProductsApi(page, limit, category);
  return data?.total ?? 0;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { page ,category} = await searchParams;
  const categories = await fetchFlatAllCategories();
  const total = await fetchProductsTotal(page, category);

  return (
    <div>
      <PageBreadcrumb pageTitle="Product List" />
      <div className="space-y-6">
        <ComponentCard title="Products">
          <div className="w-full overflow-x-auto">
            <div className="my-2 flex flex-col gap-y-1 w-fit">
              <h1 className="text-sm text-white">Category</h1>
              <CategoryFilter categories={categories}/>
            </div>
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {headers.map((header, i) => (
                        <th
                          key={i}
                          className="px-5 py-3 sm:px-6 text-start text-theme-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <Suspense fallback={<LoadingSkeleton />}>
                    <ProductsTableBody
                      page={page}
                      category={category}
                      headerCount={headers.length}
                    />
                  </Suspense>
                </table>
              </div>
            </div>
            <Pagination total={total} limit={limit} />
          </div>
        </ComponentCard>
      </div>
    </div>
  );
}
