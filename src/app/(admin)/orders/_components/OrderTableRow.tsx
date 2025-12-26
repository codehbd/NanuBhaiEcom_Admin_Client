"use client";
import React from "react";
import dayjs from "dayjs";
import {
  TOrder,
  TOrderStatus,
  TPaymentStatus,
  TPaymentType,
} from "@/types/order";
import EditOrderModal from "./EditOrderModal";
import { deleteOrderAction } from "@/actions/order";
import toast from "react-hot-toast";
import {
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  Package,
  RotateCcw,
  Smartphone,
  Truck,
  Undo2,
  X,
  XCircle,
} from "lucide-react";
import ConfirmModal from "@/components/modals/ConfirmModal";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrderTableRow({ order }: { order: TOrder }) {
  async function handleDelete(id: string) {
    const result = await deleteOrderAction(id);
    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.error(result?.data?.message || "Order deleted successfully");
    }
  }

  // Get status badge
  const getStatusBadge = (status: TOrderStatus) => {
    switch (status) {
      case "placed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Placed
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </span>
        );
      case "shipping":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Truck className="w-3 h-3 mr-1" />
            Shipping
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      case "returned":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <RotateCcw className="w-3 h-3 mr-1" />
            Returned
          </span>
        );
      case "refunded":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
            <Undo2 className="w-3 h-3 mr-1" />
            Refunded
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
            <X className="w-3 h-3 mr-1" />
            Cancelled
          </span>
        );

      default:
        return null;
    }
  };

  // Get payment status badge
  const getPaymentStatusBadge = (status: TPaymentStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "not_paid":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Not paid
          </span>
        );
      default:
        return null;
    }
  };

  // Get payment type badge
  const getPaymentTypeBadge = (status: TPaymentType) => {
    switch (status) {
      case "bkash":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
            <Smartphone className="w-3 h-3 mr-1" />
            BKASH
          </span>
        );
      case "nagad":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <Smartphone className="w-3 h-3 mr-1" />
            NAGAD
          </span>
        );
      case "card":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CreditCard className="w-3 h-3 mr-1" />
            CARD
          </span>
        );
      case "cod":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Package className="w-3 h-3 mr-1" />
            COD
          </span>
        );
      default:
        return null;
    }
  };
  return (
    <tr
      key={`product-${order._id}`}
      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 h-[72px]"
    >
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {order?.orderId}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {dayjs(order?.createdAt).format("DD MMM, YYYY hh:mm:ss A")}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {getStatusBadge(order?.status)}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {order?.grossAmount}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {order?.shippingAmount}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {order?.netAmount}
        </span>
      </td>

      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {getPaymentTypeBadge(order?.paymentType)}
        </span>
      </td>
      <td className="px-5 py-4 sm:px-6 text-start">
        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white">
          {getPaymentStatusBadge(order?.paymentStatus)}
        </span>
      </td>

      <td className="px-5 py-4 sm:px-6 text-start">
        <div className="flex items-center gap-2">
          <OrderDetailsModal order={order} />
          <EditOrderModal id={order?._id} />
          <ConfirmModal
            heading="Delete Item"
            text="Are you sure you want to delete this item? This action cannot be undone."
            onConfirm={() => handleDelete(order?._id)}
            btnClass="bg-red-400 hover:bg-red-500"
          />
        </div>
      </td>
    </tr>
  );
}
