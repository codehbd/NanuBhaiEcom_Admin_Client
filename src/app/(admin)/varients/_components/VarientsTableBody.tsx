import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import Pagination from "@/components/Pagination";
import VarientTableRow from "./VarientTableRow";
import { getAllVarientsApi } from "@/services/varientsApi";
import { TVariant } from "@/types/varient";

async function fetchVarients(
  page?: number,
  limit?: number
): Promise<{ varients: TVariant[]; total: number }> {
  const data = await getAllVarientsApi(page, limit);
  return { varients: data?.varients, total: data?.total };
}
export default async function VarientsTableBody({ page }: { page?: number }) {
  let content = null;
  let totalPage = 0;
  const limit = 5;
  try {
    const { varients, total } = await fetchVarients(page, limit);
    totalPage = total;

    content = varients?.length ? (
      varients.map((varient: TVariant) => (
        <VarientTableRow key={varient._id} varient={varient} />
      ))
    ) : (
      <tr>
        <td
          colSpan={5}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No varients found" />
        </td>
      </tr>
    );
  } catch (error) {
    content = (
      <tr>
        <td
          colSpan={5}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <ErrorMessage message={(error as Error).message} />
        </td>
      </tr>
    );
  }
  return (
    <>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {content}
      </tbody>
      <Pagination total={totalPage} limit={limit} />
    </>
  );
}
