"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import { TOrder } from "@/types/order";
import Image from "next/image";
import { getImageUrl } from "@/utils";

export default function OrderDetailsModal({ order }: { order: TOrder }) {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      {/* Trigger */}
      <button onClick={openModal} className="p-1 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
       <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      </button>

      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[720px] p-5 lg:p-8"
      >
        <div className="space-y-6">
          {/* Heading */}
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Order Details
          </h4>

          {/* Order Info */}
          <div>
            <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Order Info
            </h5>
            <div className="grid grid-cols-2 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              <span>Status:</span>
              <span className="capitalize">{order.status}</span>
              <span>Payment Status:</span>
              <span className="capitalize">{order.paymentStatus}</span>
              <span>Payment Type:</span>
              <span className="uppercase">{order.paymentType}</span>
              <span>Total Amount:</span>
              <span>{order.netAmount} ৳</span>
              <span>Placed On:</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>

          {/* Customer Info */}
          {order.user?.[0] && (
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Customer
              </h5>
              <div className="flex items-center gap-3">
                {order.user[0].image && <Image
                  src={getImageUrl(order.user[0].image)}
                  alt={order.user[0].name}
                  width={50}
                  height={50}
                  className="w-12 h-12 rounded-full"
                />}
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium">{order.user[0].name}</p>
                  <p>{order.user[0].email}</p>
                  <p>{order.user[0].phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {order.shippingaddress?.[0] && (
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shipping Address
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {order.shippingaddress[0].street}, {order.shippingaddress[0].city},{" "}
                {order.shippingaddress[0].postCode}, {order.shippingaddress[0].country}
              </p>
            </div>
          )}

          {/* Order Items */}
          {order.orderitems?.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                Items
              </h5>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {order.orderitems.map((item) => (
                  <div
                    key={item?._id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center gap-3">
                     {item?.image && <Image
                        src={getImageUrl(item?.image)}
                        alt={item?.name}
                        width={100}
                        height={100}
                        className="w-12 h-12 rounded object-cover"
                      />}
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item?.name}</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          Qty: {item?.quantity} × {item?.price}৳
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item?.total}৳</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
