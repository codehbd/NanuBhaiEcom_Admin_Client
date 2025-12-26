"use client";

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
  updateProductSchema,
  UpdateProductSchemaType,
} from "@/validation/product.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { TProduct } from "@/types/product";
import { getImageUrl } from "@/utils";
import {
  deleteProductImageAction,
  updateProductAction,
} from "@/actions/product";
import ConfirmModal from "@/components/modals/ConfirmModal";

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

export default function EditProduct({
  categories,
  brands,
  product,
  id,
}: {
  categories: TCategory[];
  brands: TBrand[];
  product: TProduct;
  id: string;
}) {
  // Build category map + roots (memoized)
  const { rootCategories, categoryMap } = useMemo(() => {
    const map = new Map<string, any>();
    categories.forEach((c) => map.set(c._id, { ...c, children: [] }));

    const roots: any[] = [];

    map.forEach((cat) => {
      if (cat.parentId) {
        const parent = map.get(cat.parentId);
        if (parent) parent.children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    return { rootCategories: roots, categoryMap: map };
  }, [categories]);

  // Dynamic levels array: each element is an array of categories for that select
  const [categoryLevels, setCategoryLevels] = useState<TCategory[][]>([
    rootCategories,
  ]);

  // Product local uploaded preview images (new ones)
  const [productImages, setProductImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductSchemaType>({
    defaultValues: {
      name: "",
      categoryId: "",
      brandId: "",
      description: "",
      price: 1,
      previousPrice: 1,
      extraPrice: 1,
      stock: 1,
      featured: "false",
      location: "Dhaka",
      freeDelivery: "false",
      images: [],
    },
    resolver: zodResolver(updateProductSchema) as any,
  });

  // Pre-fill product form values on product load (existing behavior)
  useEffect(() => {
    if (product) {
      reset({
        name: product?.name,
        categoryId: product?.categoryId,
        brandId: product?.brandId || "",
        description: product?.description,
        price: product?.price,
        previousPrice: product?.previousPrice ?? undefined,
        extraPrice: product?.extraPrice ?? undefined,
        stock: product?.stock,
        featured: product?.featured ? "true" : "false",
        location: product?.location as any,
        freeDelivery: product?.freeDelivery ? "true" : "false",
        images: [],
      });

     if (product?.categoryId && categoryMap.size) {
  const chain: string[] = [];
  let curId = product.categoryId;

  // Build chain root → selected
  while (curId) {
    const node = categoryMap.get(curId);
    if (!node) break;
    chain.unshift(node._id);
    curId = node.parentId;
  }

  const levels: TCategory[][] = [rootCategories];

  // Build dynamic levels
  for (let i = 0; i < chain.length; i++) {
    const node = categoryMap.get(chain[i]);
    if (node?.children?.length) {
      levels.push(node.children);
    }
  }

  // Set all levels
  setCategoryLevels(levels);

  // 🔥 Set selected values for each level
  chain.forEach((catId, index) => {
    setValue(`category-level-${index}` as any, catId, { shouldValidate: false });
  });

  // 🔥 Ensure main categoryId is filled
  setValue("categoryId", product.categoryId, { shouldValidate: false });

} else {
  setCategoryLevels([rootCategories]);
}

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, categoryMap, rootCategories, reset]);

  // Keep files and form images in sync (existing behavior)
  useEffect(() => {
    if (files.length) {
      setValue("images", files, { shouldValidate: true });
    } else {
      // clear images field when no files
      setValue("images", [], { shouldValidate: true });
    }
  }, [files, setValue]);

  // Dropzone logic (existing behavior)
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
    setProductImages((prev) => [
      ...prev,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  });

  // When user picks a category at a particular level:
  const handleCategoryChange = (levelIndex: number, value: string) => {
    // update the actual categoryId form field
    setValue("categoryId", value, { shouldValidate: true });

    const selected = categoryMap.get(value);

    // trim deeper levels beyond current levelIndex
    const updatedLevels = categoryLevels.slice(0, levelIndex + 1);

    // if selected has children, push them as next level
    if (selected?.children?.length) {
      updatedLevels.push(selected.children);
    }

    setCategoryLevels(updatedLevels);
  };

  async function onSubmit(data: UpdateProductSchemaType) {
    const formDataToSend = new FormData();
    for (const key in data) {
      if (key === "images") continue;
      formDataToSend.append(key, (data as any)[key]);
    }
    files.forEach((file) => formDataToSend.append("images", file));

    const result = await updateProductAction(formDataToSend, id);
    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof UpdateProductSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(result?.data?.message || "Product updated successfully!");
      router.push("/products");
    }
  }

  const deleteImage = async (imgId: string) => {
    const result = await deleteProductImageAction(imgId);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(
        result?.data?.message || "Product image deleted successfully!"
      );
    }
  };

  return (
    <ComponentCard title="Edit Product">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid gap-6">
          {/* Dropzone */}
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
                        {productImages.map((image, index) => (
                          <div key={index} className="relative w-full h-32">
                            {image && (
                              <Image
                                src={image}
                                alt={`Product ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
                              />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
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
            {errors?.images && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.images?.message}
              </p>
            )}
          </div>

          {/* Existing Images */}
          <div>
            <Label htmlFor="name">Existing Images</Label>
            <div className="flex gap-4 mb-4">
              {product?.images?.length &&
                product?.images?.map((img, index) => (
                  <div key={index} className="relative">
                    {img?.image && (
                      <Image
                        src={getImageUrl(img?.image)}
                        alt={`Product ${index + 1}`}
                        width={100}
                        height={100}
                        className="object-cover rounded-lg"
                      />
                    )}
                    <ConfirmModal
                      heading="Delete Item"
                      text="Are you sure you want to delete this item? This action cannot be undone."
                      onConfirm={() => deleteImage(img?._id)}
                      btnClass="text-red-400 bg-red-400 hover:bg-red-500"
                      trigger={
                        <button
                          type="button"
                          className="absolute w-6 h-6 top-2 right-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600 z-10"
                        >
                          ✕
                        </button>
                      }
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Product Name */}
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter product name"
                  {...field}
                />
              )}
            />
            {errors?.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Category & Brand */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label>Product Category</Label>

              <div className="flex flex-col gap-4">
                {categoryLevels.map((level, levelIndex) => (
                  <Controller
                    key={levelIndex}
                    name={`category-level-${levelIndex}` as any}
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

                          // Update actual categoryId
                          setValue("categoryId", val, { shouldValidate: true });

                          // handle deeper levels
                          handleCategoryChange(levelIndex, val);
                        }}
                      />
                    )}
                  />
                ))}
              </div>

              {errors?.categoryId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

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
              {errors?.brandId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.brandId.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
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
            {errors?.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors?.description?.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {/* Price */}
            <div>
              <Label htmlFor="price">Price</Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="price"
                    placeholder="Enter product price"
                    {...field}
                  />
                )}
              />
              {errors?.price && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.price?.message}
                </p>
              )}
            </div>

            {/* Previous Price */}
            <div>
              <Label htmlFor="previousPrice">Previous Price</Label>
              <Controller
                name="previousPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="previousPrice"
                    placeholder="Enter product previous price"
                    {...field}
                  />
                )}
              />
              {errors?.previousPrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.previousPrice?.message}
                </p>
              )}
            </div>

            {/* Extra Price */}
            <div>
              <Label htmlFor="extraPrice">Extra Price </Label>
              <Controller
                name="extraPrice"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="extraPrice"
                    placeholder="Enter product extra price"
                    {...field}
                  />
                )}
              />
              {errors?.extraPrice && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.extraPrice?.message}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Input
                    type="number"
                    id="stock"
                    placeholder="Enter product stock"
                    {...field}
                  />
                )}
              />
              {errors?.stock && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.stock?.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-x-8">
            {/* Product Location */}
            <div>
              <Label>Product Location</Label>
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <Select
                    options={divisions.map((d) => ({
                      label: d.label,
                      value: d.value,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.location && (
                <p className="text-xs text-red-500">{errors.location.message}</p>
              )}
            </div>

            {/* Free Delivery */}
            <div>
              <Label>Free Delivery</Label>
              <div className="flex gap-6">
                <Controller
                  name="freeDelivery"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Radio
                        name={field.name}
                        id="freeDeliveryYes"
                        label="Yes"
                        value="true"
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                      />
                      <Radio
                        name={field.name}
                        id="freeDeliveryNo"
                        label="No"
                        value="false"
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                      />
                    </>
                  )}
                />
              </div>
            </div>

            {/* Featured Product */}
            <div>
              <Label>Featured Product</Label>
              <div className="flex gap-6">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Radio
                        name={field.name}
                        id="featuredYes"
                        label="Yes"
                        value="true"
                        checked={field.value === "true"}
                        onChange={() => field.onChange("true")}
                      />
                      <Radio
                        name={field.name}
                        id="featuredNo"
                        label="No"
                        value="false"
                        checked={field.value === "false"}
                        onChange={() => field.onChange("false")}
                      />
                    </>
                  )}
                />
              </div>
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
              {isSubmitting ? "Updatig..." : "Update Product"}
            </button>
          </div>
        </div>
      </Form>
    </ComponentCard>
  );
}
