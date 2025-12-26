import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { Suspense } from "react";
import Loading from "../../test-loading";

import { getAllProductsApi } from "@/services/productApi";
import { TProduct } from "@/types/product";
import EditDiscount from "./_components/EditDiscount";
import { TDiscount, TDiscountTier } from "@/types/discount";
import {
  getDiscountTiersApi,
  getSingleDiscountApi,
} from "@/services/discountsApi";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";
import { TCategory } from "@/types/category";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Discount ${id} | NanuBhai`,
    description: "An ecommerce platform",
  };
}

async function fetchAllDiscountTiers(): Promise<TDiscountTier[]> {
  const data = await getDiscountTiersApi();
  return data?.discountTiers ?? [];
}
async function fetchAllProducts(): Promise<TProduct[]> {
  const data = await getAllProductsApi(1, 100000);
  return data?.products ?? [];
}
async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}
async function fetchSingleProduct(id: string): Promise<{
  discount: TDiscount;
  associations?: {
    products?: string[];
    categories?: string[];
    tiers?: string[];
  };
}> {
  const data = await getSingleDiscountApi(id);
  return { discount: data?.discount, associations: data?.associations };
}
export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  try {
    const { discount, associations } = await fetchSingleProduct(id);
    const [discountTiers, products, categories] = await Promise.all([
      fetchAllDiscountTiers(),
      fetchAllProducts(),
      fetchFlatAllCategories(),
    ]);
    return (
      <Suspense fallback={<Loading />}>
        <div>
          <PageBreadcrumb pageTitle="Edit Discount" />
          <div className="space-y-6">
            <EditDiscount
              discount={discount}
              associations={associations}
              discountTiers={discountTiers}
              products={products}
              categories={categories}
              id={id}
            />
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
