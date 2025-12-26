import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { Suspense } from "react";
import Loading from "../../test-loading";
import { TVariant } from "@/types/varient";
import { getSingleVarientApi } from "@/services/varientsApi";
import EditVarient from "./_components/EditVarient";
import { getAllProductsApi } from "@/services/productApi";
import { getAllVarientAttributesApi } from "@/services/varientAttributesApi";
import { TProduct } from "@/types/product";
import { TVariantAttribute } from "@/types/varient-attribute";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Varient ${id} | NanuBhai`,
    description: "An ecommerce platform",
  };
}

async function fetchSingleVarient(id: string): Promise<TVariant> {
  const data = await getSingleVarientApi(id);
  return data?.varient ?? null;
}
async function fetchAllAttributes(): Promise<TVariantAttribute[]> {
  const data = await getAllVarientAttributesApi();
  return data?.varientsAttr ?? [];
}

async function fetchAllProducts(): Promise<TProduct[]> {
  const data = await getAllProductsApi(1, 100000);
  return data?.products ?? [];
}
export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  try {
    const [varient, products, attributes] = await Promise.all([
      fetchSingleVarient(id),
      fetchAllProducts(),
      fetchAllAttributes(),
    ]);
    return (
      <Suspense fallback={<Loading />}>
        <div>
          <PageBreadcrumb pageTitle="Edit Varient" />
          <div className="space-y-6">
            <EditVarient
              varient={varient}
              products={products}
              attributes={attributes}
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
