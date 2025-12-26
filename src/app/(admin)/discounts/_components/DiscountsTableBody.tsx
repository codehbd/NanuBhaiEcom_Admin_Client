import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import Pagination from "@/components/Pagination";
import DiscountsTableRow from "./DiscountsTableRow";
import { getAllDiscountsApi } from "@/services/discountsApi";
import { TDiscount } from "@/types/discount";

async function fetchDiscounts(
  page?: number,
  limit?: number
): Promise<{ discounts: TDiscount[]; total: number }> {
  const data = await getAllDiscountsApi(page, limit);
  return { discounts: data?.discounts, total: data?.total };
}
export default async function DiscountsTableBody({
  page,
  headers,
}: {
  page?: number;
  headers?: string[];
}) {
  let content = null;
  let totalPage = 0;
  const limit = 5;
  try {
    const { discounts, total } = await fetchDiscounts(page, limit);
    totalPage = total;

    content = discounts?.length ? (
      discounts.map((discount: TDiscount) => (
        <DiscountsTableRow key={discount._id} discount={discount} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headers?.length}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No discounts found!" />
        </td>
      </tr>
    );
  } catch (error) {
    content = (
      <tr>
        <td
          colSpan={headers?.length}
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
