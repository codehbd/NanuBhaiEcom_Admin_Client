"use client";
import React from "react";
import toast from "react-hot-toast";
import { getImageUrl } from "@/utils";
import Image from "next/image";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { TVariant } from "@/types/varient";
import { deleteVarientAction } from "@/actions/varient";

export default function VarientTableRow({ varient }: { varient: TVariant }) {
  async function handleDelete(id: string) {
    const result = await deleteVarientAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }
  return (
    <tr
      key={`product-${varient._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        {varient?.image && (
          <Image
            src={getImageUrl(varient?.image)}
            alt="Varient"
            width={100}
            height={100}
            className="w-20 h-20 rounded-md"
          />
        )}
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {varient?.sku}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {varient?.price}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {varient?.stock}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <Link
            href={`/varients/${varient?._id}`}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <PencilLine size={20} />
          </Link>
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(varient?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
