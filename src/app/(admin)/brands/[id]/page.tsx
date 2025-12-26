import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import EditBrand from "./_components/EditBrand";
import { getSingleBrandApi } from "@/services/brandApi";
import { Suspense } from "react";
import Loading from "@/components/Loading";
import NoData from "@/components/NoData";

type Params = Promise<{ id: string }>;
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Brand ${id} | NanuBhai`,
    description: "An ecommerce platform",
  };
}

async function fetchSingleBrand(id: string) {
  const data = await getSingleBrandApi(id);
  return data?.brand ?? null;
}
export default async function EditBrandPage({ params }: { params: Params }) {
  const { id } = await params;
  try {
    const brand = await fetchSingleBrand(id);
    return (
    <Suspense fallback={<Loading />}>
      <div>
      <PageBreadcrumb pageTitle="Edit Brand" />
      <div className="space-y-6">
       {brand ? <EditBrand brand={brand} id={id}/> : <NoData message="Brand not found!" />}
      </div>
    </div>
    </Suspense>
  );
  } catch(error){
    return <ErrorMessage message={(error as Error).message} />;
  }
  
}