"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, {  useState } from "react";
import {useForm,Controller} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {  ResetPasswordSchemaType, resetUserPasswordSchema} from "@/validation/user.dto";
import {  resetPasswordAction } from "@/actions/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ResetPasswordForm({token} : {token : string}) {
  const router = useRouter();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordSchemaType>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(resetUserPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    const result = await resetPasswordAction(data,token);

    if (!result.success) {
      if (result?.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          if (messages?.errors[0]) {
            setError(field as keyof ResetPasswordSchemaType, {
              type: "manual",
              message: messages?.errors[0],
            });
          }
        });
      } else if (result.message) {
        toast.error(result.message);
      }
    } else {
      router.push("/signin")
    }
  };


  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Admin Reset Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your new password to reset!
            </p>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
               
                  <div>
                  <Label>
                   New Password <span className="text-error-500">*</span>{" "}
                  </Label>
                 <div className="relative">
                    <Controller
                      name="newPassword"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showNewPassword ? (
                        <EyeIcon className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeCloseIcon className="text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors?.newPassword && <p className="text-xs text-red-500">{errors?.newPassword?.message}</p>}
                 </div>
                 <div>
                  <Label>
                   Confirm Password <span className="text-error-500">*</span>{" "}
                  </Label>
                 <div className="relative">
                    <Controller
                      name="confirmPassword"
                      control={control}
                      render={({ field }) => (
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Enter confirm password"
                          {...field}
                          disabled={isSubmitting}
                        />
                      )}
                    />
                    <span
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="text-gray-500 dark:text-gray-400" />
                      ) : (
                        <EyeCloseIcon className="text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </div>
                  {errors?.confirmPassword && <p className="text-xs text-red-500">{errors?.confirmPassword?.message}</p>}
                 </div>
                <div>
                  <Button className="w-full" size="sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting...
                      </>
                    ) : (
                      'Reset'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
