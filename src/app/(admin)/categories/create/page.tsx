import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";
import CreateCategory from "./_components/CreateCategory";
import { TCategory } from "@/types/category";
import { Suspense } from "react";
import Loading from "../../test-loading";

export const metadata: Metadata = {
  title: "Category Category | NanuBhai",
  description: "An ecommerce platform",
};

async function fetchFlatAllCategories(): Promise<TCategory[]> {
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}
export default async function CreateCategoryPage() {
  try {
    const categories = await fetchFlatAllCategories();
    return (
      <Suspense fallback={<Loading />}>
        <div>
          <PageBreadcrumb pageTitle="Create Category" />
          <div className="space-y-6">
            <CreateCategory categories={categories} />
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
}
