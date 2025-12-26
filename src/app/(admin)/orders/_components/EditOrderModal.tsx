"use client";
import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import Select from "@/components/form/Select";
import { useForm,Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changeOrderStatusSchema, ChangeOrderStatusSchemaType } from "@/validation/order.dto";
import { changeOrderStatusAction } from "@/actions/order";
import toast from "react-hot-toast";

export default function EditOrderModal({id} : {id : string}) {
  const { isOpen, openModal, closeModal } = useModal();
    const [serverError, setServerError] = useState("");
  
  const {handleSubmit,control,formState : {errors,isSubmitting},setError} = useForm({defaultValues : {
    status : "placed",
    paymentStatus : "not_paid"
  },resolver : zodResolver(changeOrderStatusSchema)})
  
  async function onSubmit(data : ChangeOrderStatusSchemaType){
    setServerError("");
   const result = await changeOrderStatusAction(data,id);
    if (!result.success) {
        if (result?.fieldErrors) {
          Object.entries(result.fieldErrors).forEach(([field, messages]) => {
            if (messages?.errors[0]) {
              setError(field as keyof ChangeOrderStatusSchemaType, {
                type: "manual",
                message: messages?.errors[0],
              });
            }
          });
        } else if (result.message) {
          toast.error(result.message);
        }
      } else {
        closeModal();
      }

    }
  return (
    <>
      <button
           onClick={openModal}
           className="p-1 text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
        >
         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
             </svg>
      </button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Change Order Info
          </h4>

            {serverError && (
                    <p className="text-red-500 text-sm bg-red-100 p-2 rounded">
                      {serverError}
                    </p>
            )}
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Order Status</Label>
               <Controller
                    name="status"
                    control={control}
                    render={({ field }) => 
                <Select {...field} options={[
                { label: "Placed", value: "placed" },
                { label: "Processing", value: "processing" },
                { label: "Shipping", value: "shipping" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
                { label: "Returned", value: "returned" },
                { label: "Refunded", value: "refunded" }
                 ]}/>}
                  />
               {errors?.status && <p className="text-xs text-red-500">{errors?.status?.message}</p>}
            </div>

            <div className="col-span-1">
              <Label>Payment Status</Label>
              <Controller
                name="paymentStatus"
                control={control}
                render={({ field }) => 
                <Select {...field} options={[
                { label: "Not Paid", value: "not_paid" },
                { label: "Paid", value: "paid" },
              ]}/>}
                  />
               {errors?.paymentStatus && <p className="text-xs text-red-500">{errors?.paymentStatus?.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal}>
              Close
            </Button>
            <Button size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating.." : "Update"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
