"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "@/components/form/Select";

import {
  createShippingSchema,
  CreateShippingSchemaType,
} from "@/validation/shipping.dto";
import { createShippingCostAction } from "@/actions/shipping";

export default function CreateShipping() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateShippingSchemaType>({
    defaultValues: {
      division: "Dhaka",
      cost: 0,
    },
    resolver: zodResolver(createShippingSchema) as any,
  });

  async function onSubmit(data: CreateShippingSchemaType) {
    const result = await createShippingCostAction(data);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof CreateShippingSchemaType, {
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
        result?.data?.message || "Shipping cost created successfully!"
      );
    }
  }

  return (
    <ComponentCard title="Create Shipping Cost">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Division  */}
          <div>
            <Label>Division *</Label>
            <Controller
              name="division"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { label: "Barishal", value: "Barishal" },
                    { label: "Chattogram", value: "Chattogram" },
                    { label: "Dhaka", value: "Dhaka" },
                    { label: "Khulna", value: "Khulna" },
                    { label: "Rajshahi", value: "Rajshahi" },
                    { label: "Rangpur", value: "Rangpur" },
                    { label: "Mymensingh", value: "Mymensingh" },
                    { label: "Sylhet", value: "Sylhet" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors?.division && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.division?.message}
              </p>
            )}
          </div>

          {/* Cost */}
          <div>
            <Label htmlFor="cost">Cost *</Label>
            <Controller
              name="cost"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="cost"
                  placeholder="Enter shipping cost"
                  {...field}
                />
              )}
            />
            {errors?.cost && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.cost?.message}
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
            {isSubmitting ? "Creating..." : "Create Shipping Cost"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
