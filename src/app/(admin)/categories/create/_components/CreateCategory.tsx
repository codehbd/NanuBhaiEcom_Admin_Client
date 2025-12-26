"use client";

import ComponentCard from "@/components/common/ComponentCard";
import Form from "@/components/form/Form";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { TCategory } from "@/types/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  CeateCategorySchemaType,
  createCategorySchema,
} from "@/validation/category.dto";
import { createCategoryAction } from "@/actions/category";

export default function CreateCategory({
  categories,
}: {
  categories: TCategory[];
}) {
  const [productImage, setProductImage] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CeateCategorySchemaType>({
    defaultValues: {
      name: "",
      parentId: "",
      image: undefined,
    },
    resolver: zodResolver(createCategorySchema),
  });

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
      "image/svg+xml": [".svg"],
    },
    multiple: false,
  });

  async function onSubmit(data: CeateCategorySchemaType) {
    const formDataToSend = new FormData();

    // Append normal fields
    formDataToSend.append("name", data.name);
    if (data.parentId) formDataToSend.append("parentId", data.parentId);

    // Append the file
    if (file) {
      formDataToSend.append("image", file);
    }

    const result = await createCategoryAction(formDataToSend);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof CeateCategorySchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      toast.success(result?.data?.message || "Category created successfully!");
      router.push("/categories");
    }
  }

  return (
    <ComponentCard title="Create New Category">
      <Form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dropzone */}
          <div>
            <Label>Category Image</Label>
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
                        Supports: SvG, PNG, JPG, WebP
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

          <div className="flex flex-col gap-y-6">
            {/* Parent Category  */}
            <div>
              <Label>Parent Category</Label>
              <Controller
                name="parentId"
                control={control}
                render={({ field }) => (
                  <Select
                    options={categories.map((c) => ({
                      label: c.name,
                      value: c._id,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors?.parentId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.parentId.message}
                </p>
              )}
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="price">Category Name *</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter category name"
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
            {isSubmitting ? "Creating..." : "Create Category"}
          </button>
        </div>
      </Form>
    </ComponentCard>
  );
}
