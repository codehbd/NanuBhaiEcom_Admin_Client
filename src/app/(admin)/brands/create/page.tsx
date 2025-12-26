import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import ErrorMessage from "@/components/ErrorMessage";
import CreateBrand from "./_components/CreateBrand";

export const metadata: Metadata = {
  title: "Create Brand | NanuBhai",
  description: "An ecommerce platform",
};

export default async function CreateBrandPage() {
  try {
 return (
    <div>
      <PageBreadcrumb pageTitle="Create Brand" />
      <div className="space-y-6">
        <CreateBrand/>
      </div>
    </div>
  );
  } catch  {
    return <ErrorMessage/>;
  }
  
}