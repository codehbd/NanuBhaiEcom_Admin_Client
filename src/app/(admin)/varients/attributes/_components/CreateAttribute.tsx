"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  CreateAttributeVarientSchemaType,
  createVarientAttributeSchema,
} from "@/validation/varient.dto";
import { createVarientAttributeAction } from "@/actions/varient";

export default function CreateAttribute() {
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateAttributeVarientSchemaType>({
    defaultValues: {
      name: "",
      value: "",
    },
    resolver: zodResolver(createVarientAttributeSchema),
  });

  async function onSubmit(data: CreateAttributeVarientSchemaType) {
    const result = await createVarientAttributeAction(data);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof CreateAttributeVarientSchemaType, {
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
        result?.data?.message || "Varient attributes created successfully!"
      );
    }
  }

  return (
    <ComponentCard title="Create New Varient">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Attribute Name *</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter attribute name"
                  {...field}
                />
              )}
            />
            {errors?.name && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.name?.message}
              </p>
            )}
          </div>

          {/* Value */}
          <div>
            <Label htmlFor="value">Attribute Value *</Label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="value"
                  placeholder="Enter attribute value"
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
            {isSubmitting ? "Creating..." : "Create Attribute"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
