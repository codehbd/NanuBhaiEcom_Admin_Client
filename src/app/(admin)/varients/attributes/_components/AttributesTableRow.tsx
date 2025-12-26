"use client";
import React from "react";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/modals/ConfirmModal";
import { TVariantAttribute } from "@/types/varient-attribute";
import { deleteVarientAttributeAction } from "@/actions/varient";

export default function AttributesTableRow({
  attribute,
}: {
  attribute: TVariantAttribute;
}) {
  async function handleDelete(id: string) {
    const result = await deleteVarientAttributeAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }
  return (
    <tr
      key={`varient-${attribute._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {attribute?.name}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {attribute?.value}
        </span>
      </td>

      <td className="px-5 py-4 sm:px-6 text-start">
        <ConfirmModal
          heading="Delete Item"
          text="Are you sure you want to delete this item? This action cannot be undone."
          onConfirm={() => handleDelete(attribute?._id)}
          btnClass="bg-red-400 hover:bg-red-500"
        />
      </td>
    </tr>
  );
}
