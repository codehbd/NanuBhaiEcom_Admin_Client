import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import CreateVarient from "./_components/CreateVarient";
import { TProduct } from "@/types/product";
import { getAllProductsApi } from "@/services/productApi";
import { getAllVarientAttributesApi } from "@/services/varientAttributesApi";
import { TVariantAttribute } from "@/types/varient-attribute";

export const metadata: Metadata = {
  title: "Category Varient | NanuBhai",
  description: "An ecommerce platform",
};

async function fetchAllAttributes(): Promise<TVariantAttribute[]> {
  const data = await getAllVarientAttributesApi();
  return data?.attributes ?? [];
}

async function fetchAllProducts(): Promise<TProduct[]> {
  const data = await getAllProductsApi(1, 100000);
  return data?.products ?? [];
}

export default async function CreateProductPage() {
  try {
    const [attributes, products] = await Promise.all([
      fetchAllAttributes(),
      fetchAllProducts(),
    ]);
    return (
      <div>
        <PageBreadcrumb pageTitle="Create Product" />
        <div className="space-y-6">
          <CreateVarient attributes={attributes} products={products} />
        </div>
      </div>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
