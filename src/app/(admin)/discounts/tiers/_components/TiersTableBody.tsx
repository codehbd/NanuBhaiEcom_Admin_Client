import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import { TDiscountTier } from "@/types/discount";
import { getDiscountTiersApi } from "@/services/discountsApi";
import TiersTableRow from "./TiersTableRow";

async function fetchTiers(): Promise<TDiscountTier[]> {
  const data = await getDiscountTiersApi();
  return data?.discountTiers;
}
export default async function TiersTableBody({
  headers,
}: {
  headers?: string[];
}) {
  let content = null;
  try {
    const tiers = await fetchTiers();

    content = tiers?.length ? (
      tiers.map((tier: TDiscountTier) => (
        <TiersTableRow key={tier._id} tier={tier} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headers?.length}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No discount tiers found!" />
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
