import NoData from "@/components/NoData";
import { TProduct } from "@/types/product";
import { getAllProductsApi } from "@/services/productApi";
import ErrorMessage from "@/components/ErrorMessage";
import ProductTableRow from "./ProductTableRow";
import Pagination from "@/components/Pagination";

async function fetchProducts(
  page?: number,
  limit?: number,
  category ?: string,
): Promise<{ products: TProduct[]; total: number }> {
  const data = await getAllProductsApi(page, limit,category);
  return { products: data?.products, total: data?.total };
}
export default async function ProductsTableBody({
  page,
  category,
  headerCount,
}: {
  page?: number;
  category?:string;
  headerCount: number;
}) {
  let content = null;
  let totalPage = 0;
  const limit = 5;
  try {
    const { products, total } = await fetchProducts(page, limit,category);
    totalPage = total;

    content = products?.length ? (
      products.map((product: TProduct) => (
        <ProductTableRow key={product._id} product={product} />
      ))
    ) : (
      <tr>
        <td
          colSpan={headerCount}
          className="px-5 py-4 sm:px-6 text-center text-gray-500 dark:text-gray-400"
        >
          <NoData message="No products found" />
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
          <ErrorMessage message={(error as Error).message} />;
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
