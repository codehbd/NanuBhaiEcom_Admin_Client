"use client";
import React from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { deleteBrandAction } from "@/actions/brand";
import { TBrand } from "@/types/brand";

export default function BrandTableRow({ brand }: { brand: TBrand }) {
  async function handleDelete(id: string) {
    const result = await deleteBrandAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }
  return (
    <tr
      key={`product-${brand._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {brand?.name}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {brand?.status}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <Link
            href={`/brands/${brand?._id}`}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <PencilLine size={20} />
          </Link>
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(brand?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
