"use client";
import React from "react";
import toast from "react-hot-toast";
import { TProduct } from "@/types/product";
import { getImageUrl } from "@/utils";
import Image from "next/image";
import { deleteProductAction } from "@/actions/product";
import ConfirmModal from "@/components/modals/ConfirmModal";
import Link from "next/link";
import { PencilLine } from "lucide-react";

export default function ProductTableRow({ product }: { product: TProduct }) {
  async function handleDelete(id: string) {
    const result = await deleteProductAction(id);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Product deleted successfully!");
    }
  }

  return (
    <tr
      key={`product-${product._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        {product?.images[0]?.image && (
          <Image
            src={getImageUrl(product?.images[0]?.image)}
            alt="Product"
            width={100}
            height={100}
            className="w-20 h-20 rounded-md"
          />
        )}
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.name}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.category[0]?.name}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.status}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.price}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.featured ? "Featured" : "Regular"}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {product?.freeDelivery ? "Free Shipping" : "Paid Shipping"}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product?._id}`}
            className="p-1 text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <PencilLine size={20} />
          </Link>
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(product?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
