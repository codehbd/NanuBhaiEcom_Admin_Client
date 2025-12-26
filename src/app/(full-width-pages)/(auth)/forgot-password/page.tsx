import { Metadata } from "next";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password | NanuBhai",
  description: "An ecommerce platform",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
