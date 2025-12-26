"use client";
import React from "react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils";
import Image from "next/image";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { TCategory } from "@/types/category";
import { deleteCategoryAction } from "@/actions/category";

export default function CategoryTableRow({
  category,
}: {
  category: TCategory;
}) {
  async function handleDelete(id: string) {
    const result = await deleteCategoryAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }
  return (
    <tr
      key={`product-${category._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        {category?.image && (
          <Image
            src={getImageUrl(category?.image)}
            alt="Product"
            width={100}
            height={100}
            className="w-20 h-20 rounded-md"
          />
        )}
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {category?.name}
        </span>
      </td>

      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {category?.parentId ? "Child" : "Parent"}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {category?.status}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <Link
            href={`/categories/${category?._id}`}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <PencilLine size={20} />
          </Link>
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(category?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
