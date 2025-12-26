import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import CategoryTableRow from "./CategoryTableRow";
import { TCategory } from "@/types/category";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";

async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}
export default async function CategoriesTableBody({
  page,
  headerCount,
}: {
  page?: number;
  headerCount: number;
}) {
  let content = null;
  try {
    const categories = await fetchFlatAllCategories();

    content = categories?.length ? (
      categories.map((category: TCategory) => (
        <CategoryTableRow key={category._id} category={category} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headerCount}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No categories found" />
        </td>
      </tr>
    );
  } catch (error) {
    content = (
      <tr>
        <td
          colSpan={headerCount}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <ErrorMessage message={(error as Error).message} />
        </td>
      </tr>
    );
  }
  return (
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {content}
    </tbody>
  );
}
