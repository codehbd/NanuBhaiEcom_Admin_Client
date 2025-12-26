"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { generateSKU, getImageUrl } from "@/utils";
import { TVariant } from "@/types/varient";
import {
  updateVarientSchema,
  UpdateVarientSchemaType,
} from "@/validation/varient.dto";
import { updateVarientAction } from "@/actions/varient";
import MultiSelectWithCheckbox from "@/components/form/MultiSelectWithCheckbox";
import Select from "@/components/form/Select";
import { TVariantAttribute } from "@/types/varient-attribute";
import { TProduct } from "@/types/product";

export default function EditVarient({
  varient,
  attributes,
  products,
  id,
}: {
  varient: TVariant;
  attributes: TVariantAttribute[];
  products: TProduct[];
  id: string;
}) {
  const [productImage, setProductImage] = useState<string>("");
  const [selectedAttr, setSelectedAttr] = useState<string[]>([]);
  const [file, setFile] = useState<File | undefined>(undefined);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateVarientSchemaType>({
    defaultValues: {
      sku: "",
      price: 0,
      stock: 0,
      productId: "",
      image: undefined,
    },
    resolver: zodResolver(updateVarientSchema) as any,
  });

  // load existing data
  useEffect(() => {
    if (varient) {
      reset({
        sku: varient?.sku,
        productId: varient?.productId || "",
        price: varient?.price || 0,
        stock: varient?.stock || 0,
      });
    }
  }, [varient, reset]);

  // Keep files and form images in sync
  useEffect(() => {
    if (file) {
      setValue("image", file, { shouldValidate: true });
    }
  }, [file, setValue]);

  // Dropzone logic
  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
    setProductImage(() => URL.createObjectURL(acceptedFiles[0]));
  };

  const removeImage = () => {
    setProductImage(() => "");
    setFile(() => undefined);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: false,
  });

  async function onSubmit(data: UpdateVarientSchemaType) {
    const formDataToSend = new FormData();

    // Append normal fields
    if (data.productId) formDataToSend.append("productId", data.productId);
    if (data.stock) formDataToSend.append("stock", String(data.stock));
    if (data.price) formDataToSend.append("price", String(data.price));
    if (data.sku) formDataToSend.append("sku", String(data.sku));

    // Append the file
    if (file) {
      formDataToSend.append("image", file);
    }

    const result = await updateVarientAction(formDataToSend, id);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof UpdateVarientSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(result?.data?.message || "Varient updated successfully!");
      router.push("/varients");
    }
  }
  const handleAttribute = (selected: string[]) => {
    console.log(selected);
    const selectedAttributes = attributes.filter((attr) =>
      selected.includes(attr.value)
    );
    setValue("sku", generateSKU("Test", selectedAttributes));
    setSelectedAttr([...selected]);
  };
  return (
    <ComponentCard title="Edit Varient">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-y-6">
            {/* Dropzone */}
            <div>
              <Label>Varient Image</Label>
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
                    {productImage ? (
                      <div className="w-full">
                        <div className="relative w-full h-32">
                          <Image
                            src={productImage}
                            alt={`Product Image`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 z-10"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                          Drop image or click to add
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                          📷
                        </div>
                        <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                          {isDragActive
                            ? "Drop file here"
                            : "Drag & Drop varient image"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Supports: PNG, JPG, WebP
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {errors?.image && typeof errors.image.message === "string" && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.image.message}
                </p>
              )}
            </div>
            {/* Existing Image */}
            <div>
              <Label htmlFor="name">Existing Image</Label>
              {varient?.image && (
                <Image
                  src={getImageUrl(varient?.image)}
                  alt={`Category`}
                  width={100}
                  height={100}
                  className="object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-y-6">
            {/* Product  */}
            <div>
              <Label>Product</Label>
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={products?.map((p) => ({
                      label: p.name,
                      value: p._id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.productId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.productId?.message}
                </p>
              )}
            </div>

            {/* Attributes */}
            <div>
              <Label>Attributes</Label>

              <MultiSelectWithCheckbox
                options={attributes?.map((a) => ({
                  label: `${a.name}-${a.value}`,
                  value: a.value,
                }))}
                value={selectedAttr}
                onChange={handleAttribute}
              />
            </div>

            {/* SKU Name */}
            <div>
              <Label htmlFor="sku">SKU Name *</Label>
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="sku"
                    disabled={true}
                    placeholder="Enter sku name"
                    {...field}
                  />
                )}
              />
              {errors?.sku && (
                <p className="mt-1 text-xs text-red-500">
                  {errors?.sku?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
              {/* Price */}
              <div>
                <Label htmlFor="price">Varient Price *</Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="price"
                      placeholder="Enter varient price"
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

              {/* Stock */}
              <div>
                <Label htmlFor="stock">Varient Stock *</Label>
                <Controller
                  name="stock"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      id="stock"
                      placeholder="Enter varient stock"
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
            {isSubmitting ? "Updating..." : "Update Varient"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
