import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import {
  getFlatAllCategoriesApi,
  getSingleCategoryApi,
} from "@/services/categoryApi";

import EditCategory from "./_components/EditCategory";
import { TCategory } from "@/types/category";
import { Suspense } from "react";
import Loading from "../../test-loading";

type Params = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Category ${id} | NanuBhai`,
    description: "An ecommerce platform",
  };
}
async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}
async function fetchSingleCategory(id: string): Promise<TCategory> {
  const data = await getSingleCategoryApi(id);
  return data?.category ?? null;
}
export default async function EditProductPage({ params }: { params: Params }) {
  const { id } = await params;
  try {
    const [category, categories] = await Promise.all([
      fetchSingleCategory(id),
      fetchFlatAllCategories(),
    ]);
    return (
      <Suspense fallback={<Loading />}>
        <div>
          <PageBreadcrumb pageTitle="Edit Category" />
          <div className="space-y-6">
            <EditCategory categories={categories} category={category} id={id} />
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
