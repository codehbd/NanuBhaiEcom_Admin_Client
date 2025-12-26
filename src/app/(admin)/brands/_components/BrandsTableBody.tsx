import NoData from "@/components/NoData";
import ErrorMessage from "@/components/ErrorMessage";
import BrandTableRow from "./BrandTableRow";
import { getAllBrandsApi } from "@/services/brandApi";
import { TBrand } from "@/types/brand";

async function fetchAllBrands() {
  const data = await getAllBrandsApi();
  return data?.brands ?? [];
}
export default async function BrandsTableBody({
  page,
  colSpan,
}: {
  page?: number;
  colSpan: number;
}) {
  let content = null;
  try {
    const brands = await fetchAllBrands();

    content = brands?.length ? (
      brands.map((brand: TBrand) => (
        <BrandTableRow key={brand._id} brand={brand} />
      ))
    ) : (
      <tr>
        <td
          colSpan={colSpan}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No brands found" />
        </td>
      </tr>
    );
  } catch (error) {
    content = (
      <tr>
        <td
          colSpan={colSpan}
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
