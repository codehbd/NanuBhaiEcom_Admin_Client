"use client";
import React from "react";
import toast from "react-hot-toast";

import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";
import { PencilLine } from "lucide-react";
import { TDiscount } from "@/types/discount";
import dayjs from "dayjs";
import {
  activeInactiveDiscountAction,
  deleteDiscountAction,
} from "@/actions/discount";
import Switch from "@/components/form/switch/Switch";

export default function DiscountsTableRow({
  discount,
}: {
  discount: TDiscount;
}) {
  async function handleDelete(id: string) {
    const result = await deleteDiscountAction(id);
    if (!result.success) {
      toast.error(result?.message);
    }
  }
  async function handleActiveInactive(checked: boolean, id: string) {
    const result = await activeInactiveDiscountAction(
      { status: checked ? "active" : "inactive" },
      id
    );
    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([, messages]) => {
          if (messages?.errors[0]) {
            toast.error(messages?.errors[0]);
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    }
  }
  return (
    <tr
      key={`product-${discount._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {discount?.name}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {discount?.type}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {discount?.method}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <Switch
          label={discount?.status}
          onChange={(checked) => handleActiveInactive(checked, discount?._id)}
          defaultChecked={discount?.status === "active"}
        />
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {dayjs(discount?.startDate).format("D MMM, YYYY hh:mm:ssA")}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {dayjs(discount?.endDate).format("D MMM, YYYY hh:mm:ssA")}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <Link
            href={`/discounts/${discount?._id}`}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <PencilLine size={20} />
          </Link>
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(discount?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
