"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { TProduct } from "@/types/product";
import Select from "@/components/form/Select";
import MultiSelectWithCheckbox from "@/components/form/MultiSelectWithCheckbox";
import dayjs from "dayjs";
import DatePicker from "@/components/form/input/Datepicker";
import {
  createDiscountSchema,
  CreateDiscountSchemaType,
} from "@/validation/discount.dto";
import { TDiscountTier } from "@/types/discount";
import { TCategory } from "@/types/category";
import { createDiscountAction, SerializedDiscountData } from "@/actions/discount";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// Helper to serialize Dayjs dates to ISO strings
function serializeFormData(data: CreateDiscountSchemaType) {
  const start = data.startDate as any;
  const end = data.endDate as any;
  
  return {
    ...data,
    startDate: dayjs.isDayjs(start)
      ? start.toISOString()
      : typeof start === "string"
      ? start
      : start?.toISOString?.() || start,
    endDate: dayjs.isDayjs(end)
      ? end.toISOString()
      : typeof end === "string"
      ? end
      : end?.toISOString?.() || end,
  };
}

export default function CreateDiscount({
  discountTiers,
  products,
  categories,
}: {
  discountTiers: TDiscountTier[];
  products: TProduct[];
  categories: TCategory[];
}) {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateDiscountSchemaType>({
    defaultValues: {
      name: "",
      type: "product",
      method: "percentage",
      value: "" as any,
      code: "",
      minQty: "" as any,
      productIds: [],
      tierIds: [],
      categoryIds: [],
      minCartValue: "" as any,
      usageLimit: "" as any,
      startDate: dayjs(),
      endDate: dayjs().add(7, "day"),
    },
    resolver: zodResolver(createDiscountSchema) as any,
  });
  async function onSubmit(data: CreateDiscountSchemaType) {
    console.log("Form data:", data);

    try {
      // Serialize dates before passing to Server Action
      const serializedData = serializeFormData(data) as SerializedDiscountData;
      console.log("Serialized data:", serializedData);

      const result = await createDiscountAction(serializedData);
      console.log("Action result:", result);

      if (!result.success) {
        if (result?.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages?.errors[0]) {
              setError(field as keyof CreateDiscountSchemaType, {
                type: "manual",
                message: messages?.errors[0],
              });
            }
          });
        } else if (result.message) {
          toast.error(result.message);
        }
      } else {
        toast.success(result?.data?.message || "Discount created successfully!");
        router.push("/discounts");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  }

  return (
    <ComponentCard title="Create New Discount">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name  */}
          <div>
            <Label htmlFor="name">Name *</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter discount name"
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

          {/* Coupon Code  */}
          <div>
            <Label htmlFor="code">Coupon Code</Label>
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="code"
                  placeholder="Enter coupon code name"
                  {...field}
                />
              )}
            />
            {errors?.code && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.code?.message}
              </p>
            )}
          </div>

          {/* Minimum Quantity  */}
          <div>
            <Label htmlFor="minQty">Minimum Quantity</Label>
            <Controller
              name="minQty"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="minQty"
                  placeholder="Enter minimum quantity"
                  {...field}
                />
              )}
            />
            {errors?.minQty && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.minQty?.message}
              </p>
            )}
          </div>

          {/* Minimum Cart Value  */}
          <div>
            <Label htmlFor="minCartValue">Minimum Cart Value</Label>
            <Controller
              name="minCartValue"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="minCartValue"
                  placeholder="Enter minimum cart value"
                  {...field}
                />
              )}
            />
            {errors?.minCartValue && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.minCartValue?.message}
              </p>
            )}
          </div>

          {/* Usage Limit  */}
          <div>
            <Label htmlFor="usageLimit">Cart Usage Limit</Label>
            <Controller
              name="usageLimit"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="usageLimit"
                  placeholder="Enter coupon usage limit"
                  {...field}
                />
              )}
            />
            {errors?.usageLimit && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.usageLimit?.message}
              </p>
            )}
          </div>

          {/* Type  */}
          <div>
            <Label htmlFor="type">Type *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { label: "Product", value: "product" },
                    { label: "Category", value: "category" },
                    { label: "Coupon", value: "coupon" },
                    { label: "Quantity", value: "quantity" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors?.type && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.type?.message}
              </p>
            )}
          </div>

          {/* Method  */}
          <div>
            <Label htmlFor="method">Method *</Label>
            <Controller
              name="method"
              control={control}
              render={({ field }) => (
                <Select
                  options={[
                    { label: "Flat", value: "flat" },
                    { label: "Percentage", value: "percentage" },
                    { label: "Bogo", value: "bogo" },
                    { label: "Tier", value: "tier" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors?.method && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.method?.message}
              </p>
            )}
          </div>

          {/* Value */}
          <div>
            <Label htmlFor="value">Value</Label>
            <Controller
              name="value"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  id="value"
                  placeholder="Enter discount value"
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

          {/* Products  */}
          <div>
            <Label htmlFor="productIds">Products</Label>
            <Controller
              name="productIds"
              control={control}
              render={({ field }) => (
                <MultiSelectWithCheckbox
                  options={products?.map((p) => ({
                    label: `${p.name}`,
                    value: p._id,
                  }))}
                  onChange={field.onChange}
                  value={field.value || []}
                />
              )}
            />
            {errors?.productIds && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.productIds?.message}
              </p>
            )}
          </div>

          {/* Tiers */}
          <div>
            <Label htmlFor="tierIds">Tiers </Label>
            <Controller
              name="tierIds"
              control={control}
              render={({ field }) => (
                <MultiSelectWithCheckbox
                  options={discountTiers?.map((d) => ({
                    label: `${d.min}-${d.value}`,
                    value: d._id,
                  }))}
                  onChange={field.onChange}
                  value={field.value || []}
                />
              )}
            />
            {errors?.tierIds && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.tierIds?.message}
              </p>
            )}
          </div>

          {/* Categories */}
          <div>
            <Label htmlFor="categoryIds">Categories </Label>
            <Controller
              name="categoryIds"
              control={control}
              render={({ field }) => (
                <MultiSelectWithCheckbox
                  options={categories?.map((c) => ({
                    label: `${c.name}`,
                    value: c._id,
                  }))}
                  onChange={field.onChange}
                  value={field.value || []}
                />
              )}
            />
            {errors?.categoryIds && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.categoryIds?.message}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <Label htmlFor="startDate">Start Date *</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} placeholder="Pick a date & time" />
              )}
            />
            {errors?.startDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.startDate?.message}
              </p>
            )}
          </div>

          {/* End Date */}
          <div>
            <Label htmlFor="endDate">End Date *</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <DatePicker {...field} placeholder="Pick a date & time" />
              )}
            />
            {errors?.endDate && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.endDate?.message}
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
            {isSubmitting ? "Creating..." : "Create Discount"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
