import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import { getAllVarientAttributesApi } from "@/services/varientAttributesApi";
import { TVariantAttribute } from "@/types/varient-attribute";
import AttributesTableRow from "./AttributesTableRow";

async function fetchVarientAttributs(): Promise<TVariantAttribute[]> {
  const data = await getAllVarientAttributesApi();
  return data?.attributes ?? [];
}
export default async function AttributesTableBody() {
  let content = null;
  try {
    const attributes = await fetchVarientAttributs();

    content = attributes?.length ? (
      attributes.map((attribute: TVariantAttribute) => (
        <AttributesTableRow key={attribute._id} attribute={attribute} />
      ))
    ) : (
      <tr>
        <td
          colSpan={3}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No varient attributes found" />
        </td>
      </tr>
    );
  } catch (error) {
    content = (
      <tr>
        <td
          colSpan={3}
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
