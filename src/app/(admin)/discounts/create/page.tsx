import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { TProduct } from "@/types/product";
import { getAllProductsApi } from "@/services/productApi";
import CreateDiscount from "./_components/CreateDiscount";
import { getDiscountTiersApi } from "@/services/discountsApi";
import { TDiscountTier } from "@/types/discount";
import { TCategory } from "@/types/category";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";

export const metadata: Metadata = {
  title: "Create Discount | Nanuvaier Rosona Kothon - Your Online Shop",
  description: "An online store for all your needs",
};

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

export default async function CreateProductPage() {
  try {
    const [discountTiers, products, categories] = await Promise.all([
      fetchAllDiscountTiers(),
      fetchAllProducts(),
      fetchFlatAllCategories(),
    ]);
    return (
      <div>
        <PageBreadcrumb pageTitle="Create Discount" />
        <div className="space-y-6">
          <CreateDiscount
            discountTiers={discountTiers}
            products={products}
            categories={categories}
          />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
