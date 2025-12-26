import { userProfileApi } from "@/services/authApi";
import SignInForm from "./_components/SignInForm";
import { Metadata } from "next";
import AuthProvider from "@/provider/AuthProvider";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Signin | NanuBhai",
  description: "An ecommerce platform",
};
export const dynamic = "force-dynamic";
export default async function SignInPage() {
  const user = await userProfileApi();

  if (user) {
    redirect("/"); // already logged in
  }

    return (
      <AuthProvider user={user}>
        <SignInForm />
      </AuthProvider>
    );
  }

