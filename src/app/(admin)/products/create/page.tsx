import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import CreateProduct from "./_components/CreateProduct";
import ErrorMessage from "@/components/ErrorMessage";
import { getFlatAllCategoriesApi } from "@/services/categoryApi";
import { getAllBrandsApi } from "@/services/brandApi";
import { TCategory } from "@/types/category";
import { TBrand } from "@/types/brand";

export const metadata: Metadata = {
  title: "Create Product | NanuBhai",
  description: "An ecommerce platform",
};

async function fetchFlatAllCategories() : Promise<TCategory[]>{
  const data = await getFlatAllCategoriesApi();
  return data?.categories ?? [];
}

async function fetchAllBrands() : Promise<TBrand[]>{
  const data = await getAllBrandsApi();
  return data?.brands ?? [];
}

export default async function CreateProductPage() {
  try {
    const [categories, brands] = await Promise.all([fetchFlatAllCategories(), fetchAllBrands()]);
    return (
    <div>
      <PageBreadcrumb pageTitle="Create Product" />
      <div className="space-y-6">
        <CreateProduct categories={categories} brands={brands}/>
      </div>
    </div>
  );
  } catch (error) {
    return <ErrorMessage message={(error as Error).message} />;
  }
  
}