import NoData from "@/components/NoData";
import { TProduct } from "@/types/product";
import { getAllProductsApi } from "@/services/productApi";
import ErrorMessage from "@/components/ErrorMessage";
import ProductTableRow from "./ProductTableRow";

async function fetchProducts(
  page?: number,
  limit?: number,
  category?: string,
  search?: string,
): Promise<{ products: TProduct[]; total: number }> {
  const data = await getAllProductsApi(page, limit, category, search);
  return { products: data?.products, total: data?.total };
}

export default async function ProductsTableBody({
  page,
  category,
  headerCount,
  limit = 5,
  search,
}: {
  page?: number;
  category?: string;
  headerCount: number;
  limit?: number;
  search?: string;
}) {
  let content = null;
  try {
    const { products } = await fetchProducts(page, limit, category, search);

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
    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
      {content}
    </tbody>
  );
}
