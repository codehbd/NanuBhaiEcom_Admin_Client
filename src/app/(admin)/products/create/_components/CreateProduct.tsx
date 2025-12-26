"use client";

import { createProductAction } from "@/actions/product";
import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import Radio from "@/components/form/input/Radio";
import TextArea from "@/components/form/input/TextArea";

import { TBrand } from "@/types/brand";
import { TCategory } from "@/types/category";

import {
  createProductSchema,
  CreateProductSchemaType,
} from "@/validation/product.dto";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface TDivions {
  label: string;
  value: string;
}

const divisions: TDivions[] = [
  { label: "Barishal", value: "Barishal" },
  { label: "Chattogram", value: "Chattogram" },
  { label: "Dhaka", value: "Dhaka" },
  { label: "Khulna", value: "Khulna" },
  { label: "Mymensingh", value: "Mymensingh" },
  { label: "Rajshahi", value: "Rajshahi" },
  { label: "Rangpur", value: "Rangpur" },
  { label: "Sylhet", value: "Sylhet" },
];

export default function CreateProduct({
  categories,
  brands,
}: {
  categories: TCategory[];
  brands: TBrand[];
}) {
  const router = useRouter();

  /** -----------------------------
   * Build category tree (memoized)
   ------------------------------ */
  const { rootCategories, categoryMap } = useMemo(() => {
    const map = new Map<string, any>();
    categories.forEach((c) => map.set(c._id, { ...c, children: [] }));

    const roots: any[] = [];

    map.forEach((cat) => {
      if (cat.parentId) {
        map.get(cat.parentId)?.children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return { rootCategories: roots, categoryMap: map };
  }, [categories]);

  /** -----------------------------
   * Category Levels
  ------------------------------ */
  const [categoryLevels, setCategoryLevels] = useState<TCategory[][]>([
    rootCategories,
  ]);

  const handleCategoryChange = (levelIndex: number, categoryId: string) => {
    setValue("categoryId", categoryId, { shouldValidate: true });

    const selected = categoryMap.get(categoryId);

    const updatedLevels = categoryLevels.slice(0, levelIndex + 1);
    if (selected?.children?.length) {
      updatedLevels.push(selected.children);
    }

    setCategoryLevels(updatedLevels);
  };

  /** -----------------------------
   * Form Setup
  ------------------------------ */
  const {
    handleSubmit,
    control,
    setError,
    setValue,watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductSchemaType>({
    defaultValues: {
      name: "",
      categoryId: "",
      brandId: "",
      description: "",
      price: 1,
      previousPrice: 0,
      extraPrice: 0,
      stock: 1,
      featured: "false",
      location: "Dhaka",
      freeDelivery: "false",
      images: [] as File[],
    },
    resolver: zodResolver(createProductSchema) as any,
  });

  /** -----------------------------
   * Dropzone Logic
  ------------------------------ */
  const [files, setFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    setValue("images", files, { shouldValidate: true });
  }, [files, setValue]);

  const onDrop = (accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted]);
    setProductImages((prev) => [
      ...prev,
      ...accepted.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
  });

  /** -----------------------------
   * Submit Handler
  ------------------------------ */
  const onSubmit = async (data: CreateProductSchemaType) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key !== "images") formData.append(key, value as any);
    });

    files.forEach((file) => formData.append("images", file));

    const result = await createProductAction(formData);

    if (!result.success) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (messages?.errors?.[0]) {
            setError(field as keyof CreateProductSchemaType, {
              type: "manual",
              message: messages.errors[0],
            });
          }
        }
      } else if (result.message) {
        toast.error(result.message);
      }
      return;
    }

    toast.success(result.data?.message || "Product created successfully!");
    router.push("/products");
  };
console.log(watch())
  return (
    <ComponentCard title="Create New Product">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid gap-6">
          {/* ---------------- Media Upload ---------------- */}
          <div className="col-span-full">
            <Label>Product Media</Label>

            <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
              <div
                {...getRootProps()}
                className={`dropzone rounded-xl p-7 lg:p-10 ${
                  isDragActive
                    ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                    : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
                }`}
              >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center">
                  {productImages.length > 0 ? (
                    <div className="w-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {productImages.map((img, index) => (
                          <div key={index} className="relative w-full h-32">
                            <Image
                              src={img}
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover rounded-lg"
                            />

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>

                      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                        Drop more images or click to add
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                        📷
                      </div>
                      <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                        {isDragActive
                          ? "Drop files here"
                          : "Drag & Drop product images"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Supports: PNG, JPG, WebP
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {errors.images && (
              <p className="text-xs text-red-500">{errors.images.message}</p>
            )}
          </div>

          {/* ---------------- Product Name ---------------- */}
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter product name"
                  {...field}
                />
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* ---------------- Category & Brand ---------------- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Category */}
            <div>
              <Label>Product Category *</Label>

              <div className="flex flex-col gap-4">
                {categoryLevels.map((level, idx) => (
                  <Controller
                    key={idx}
                    name={`category-level-${idx}` as any}
                    control={control}
                    render={({ field }) => (
                      <Select
                        options={level.map((c) => ({
                          label: c.name,
                          value: c._id,
                        }))}
                        value={field.value || ""}
                        onChange={(val) => {
                          field.onChange(val);
                          handleCategoryChange(idx, val);
                        }}
                      />
                    )}
                  />
                ))}
              </div>

              {errors.categoryId && (
                <p className="text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Brand */}
            <div>
              <Label>Brand</Label>
              <Controller
                name="brandId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={brands.map((b) => ({
                      label: b.name,
                      value: b._id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.brandId && (
                <p className="text-xs text-red-500">{errors.brandId.message}</p>
              )}
            </div>
          </div>

          {/* ---------------- Description ---------------- */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextArea
                  id="description"
                  placeholder="Enter product description"
                  className="border-none"
                  {...field}
                />
              )}
            />

            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* ---------------- Price / Stock ---------------- */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              { name: "price", label: "Price *" },
              { name: "previousPrice", label: "Previous Price" },
              { name: "extraPrice", label: "Extra Price" },
              { name: "stock", label: "Stock" },
            ].map(({ name, label }) => (
              <div key={name}>
                <Label htmlFor={name}>{label}</Label>
                <Controller
                  name={name as any}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id={name}
                      placeholder={`Enter product ${label.toLowerCase()}`}
                      {...field}
                    />
                  )}
                />
                {errors[name as keyof CreateProductSchemaType] && (
                  <p className="text-xs text-red-500">
                    {
                      errors[name as keyof CreateProductSchemaType]
                        ?.message as string
                    }
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* ---------------- Location / Flags ---------------- */}
          <div className="flex items-center gap-x-8">
            {/* Product Location */}
            <div>
              <Label>Product Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    options={divisions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.location && (
                <p className="text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Free Delivery */}
            <div>
              <Label>Free Delivery</Label>
              <div className="flex gap-6">
                {["true", "false"].map((val) => (
                  <Controller
                    key={val}
                    name="freeDelivery"
                    control={control}
                    render={({ field }) => (
                      <Radio
                        name={field.name}
                        id={`freeDelivery-${val}`}
                        label={val === "true" ? "Yes" : "No"}
                        value={val}
                        checked={field.value === val}
                        onChange={() => field.onChange(val)}
                      />
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Featured */}
            <div>
              <Label>Featured Product</Label>
              <div className="flex gap-6">
                {["true", "false"].map((val) => (
                  <Controller
                    key={val}
                    name="featured"
                    control={control}
                    render={({ field }) => (
                      <Radio
                        name={field.name}
                        id={`featured-${val}`}
                        label={val === "true" ? "Yes" : "No"}
                        value={val}
                        checked={field.value === val}
                        onChange={() => field.onChange(val)}
                      />
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ---------------- Submit ---------------- */}
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 text-sm font-medium text-white rounded-lg bg-brand-500 hover:bg-brand-600 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
