"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  CeateBrandSchemaType,
  createBrandSchema,
} from "@/validation/brand.dto";
import { createBrandAction } from "@/actions/brand";

export default function CreateBrand() {
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CeateBrandSchemaType>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createBrandSchema),
  });

  async function onSubmit(data: CeateBrandSchemaType) {
    const result = await createBrandAction(data);
    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof CeateBrandSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(result?.data?.message || "Brand created successfully!");
      router.push("/brands");
    }
  }

  return (
    <ComponentCard title="Create New Brand">
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
            {isSubmitting ? "Creating..." : "Create Brand"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
