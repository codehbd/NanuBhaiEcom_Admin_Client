import React from 'react'
import ResetPasswordForm from './_components/ResetPasswordForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Reset Password | NanuBhai",
  description: "An ecommerce platform",
};
interface PageProps {
  params: Promise<{ token: string }>;
}
export default async function ResetPasswordPage({ params }: PageProps) {
const {token} =  await params;
  return (
    <ResetPasswordForm token={token}/>
  )
}
