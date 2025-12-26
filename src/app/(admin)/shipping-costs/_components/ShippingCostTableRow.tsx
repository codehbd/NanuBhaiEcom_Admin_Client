"use client";
import React from "react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/modals/ConfirmModal";
import { TShipping } from "@/types/shipping";
import { deleteShippingCostAction } from "@/actions/shipping";

export default function ShippingCostTableRow({
  shipping,
}: {
  shipping: TShipping;
}) {
  async function handleDelete(id: string) {
    const result = await deleteShippingCostAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }

  return (
    <tr
      key={`product-${shipping._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {shipping?.division}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {shipping?.cost}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(shipping?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
