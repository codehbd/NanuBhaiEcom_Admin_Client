import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import { TShipping } from "@/types/shipping";
import ShippingCostTableRow from "./ShippingCostTableRow";
import { getAllShippingCostApi } from "@/services/shippingCostApi";

async function fetchShippingCosts(): Promise<TShipping[]> {
  const data = await getAllShippingCostApi();
  return data?.shippingCosts;
}
export default async function ShippingCostTableBody({
  headers,
}: {
  headers?: string[];
}) {
  let content = null;
  try {
    const shippingCosts = await fetchShippingCosts();

    content = shippingCosts?.length ? (
      shippingCosts.map((shipping: TShipping) => (
        <ShippingCostTableRow key={shipping._id} shipping={shipping} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headers?.length}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No shipping cost found!" />
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
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {content}
    </tbody>
  );
}
