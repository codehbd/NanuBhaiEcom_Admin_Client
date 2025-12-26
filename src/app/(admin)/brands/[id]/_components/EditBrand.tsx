"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  updateBrandSchema,
  UpdateBrandSchemaType,
} from "@/validation/brand.dto";
import { updateBrandAction } from "@/actions/brand";
import { TBrand } from "@/types/brand";

export default function EditBrand({
  brand,
  id,
}: {
  brand: TBrand;
  id: string;
}) {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateBrandSchemaType>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(updateBrandSchema),
  });

  async function onSubmit(data: UpdateBrandSchemaType) {
    const result = await updateBrandAction(data, id);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof UpdateBrandSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(result?.data?.message || "Brand updated successfully!");
      router.push("/brands");
    }
  }

  useEffect(() => {
    if (brand) {
      reset({ name: brand?.name });
    }
  }, [brand, reset]);

  return (
    <ComponentCard title="Edit Brand">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="namr">Brand Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter brand name"
                    {...field}
                  />
                )}
              />
              {errors?.name && (
                <p className="text-xs text-red-500">{errors?.name?.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Server Error */}
        {serverError && <p className="text-red-500 mt-2">{serverError}</p>}

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Updating..." : "Update Brand"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
