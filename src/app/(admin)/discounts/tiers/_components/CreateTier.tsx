"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  createDiscountTierSchema,
  CreateDiscountTierSchemaType,
} from "@/validation/discount.dto";
import { createDiscountTierAction } from "@/actions/discount";

export default function CreateTier() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateDiscountTierSchemaType>({
    defaultValues: {
      min: 0,
      value: 0,
    },
    resolver: zodResolver(createDiscountTierSchema) as any,
  });

  async function onSubmit(data: CreateDiscountTierSchemaType) {
    const result = await createDiscountTierAction(data);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof CreateDiscountTierSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(
        result?.data?.message || "Discount tier created successfully!"
      );
    }
  }

  return (
    <ComponentCard title="Create New Tier">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <Label htmlFor="min">Tier Min *</Label>
            <Controller
              name="min"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="min"
                  placeholder="Enter tier minimum value"
                  {...field}
                />
              )}
            />
            {errors?.min && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.min?.message}
              </p>
            )}
          </div>

          {/* Value */}
          <div>
            <Label htmlFor="value">Tier Value *</Label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="value"
                  placeholder="Enter tier value"
                  {...field}
                />
              )}
            />
            {errors?.value && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.value?.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Tier"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
