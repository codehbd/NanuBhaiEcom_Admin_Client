import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import OrderTableRow from "./OrderTableRow";
import { getAllOrdersApi } from "@/services/orderApi";
import { TOrder } from "@/types/order";
import Pagination from "@/components/Pagination";

async function fetchAllOrders(
  page?: number,
  limit?: number
): Promise<{ orders: TOrder[]; total: number }> {
  const data = await getAllOrdersApi(page, limit);
  return { orders: data?.orders, total: data?.total };
}
export default async function OrdersTableBody({
  page,
  headerCount,
}: {
  page?: number;
  headerCount: number;
}) {
  let content = null;
  let totalPage = 0;
  const limit = 5;
  try {
    const { orders, total } = await fetchAllOrders(page, limit);
    totalPage = total;

    content = orders?.length ? (
      orders.map((order: TOrder) => (
        <OrderTableRow key={order._id} order={order} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headerCount}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No orders found" />
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
    <>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        {content}
      </tbody>
      <Pagination total={totalPage} limit={limit} />
    </>
  );
}
