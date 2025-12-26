import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import EditProduct from "./_components/EditProduct";
import ErrorMessage from "@/components/ErrorMessage";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";
import { getAllBrandsApi } from "@/services/brandApi";
import { getSingleProductApi } from "@/services/productApi";
import { TProduct } from "@/types/product";
import { Suspense } from "react";
import NoData from "@/components/NoData";
import Loading from "@/components/Loading";
import { TBrand } from "@/types/brand";
import { TCategory } from "@/types/category";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Product ${id} | NanuBhai`,
    description: "An ecommerce platform",
  };
}
async function fetchProduct(id?: string): Promise<TProduct> {
  const data = await getSingleProductApi(id);
  return data?.product ?? null;
}
async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}
async function fetchAllBrands(): Promise<TBrand[]> {
  const data = await getAllBrandsApi();
  return data?.brands ?? [];
}
export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  try {
    const [product, categories, brands] = await Promise.all([
      fetchProduct(id),
      fetchFlatAllCategories(),
      fetchAllBrands(),
    ]);
    return (
      <Suspense fallback={<Loading />}>
        {product ? (
          <div>
            <PageBreadcrumb pageTitle="Edit Product" />
            <div className="space-y-6">
              <EditProduct
                categories={categories}
                brands={brands}
                product={product}
                id={id}
              />
            </div>
          </div>
        ) : (
          <NoData message="No products found" />
        )}
      </Suspense>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
