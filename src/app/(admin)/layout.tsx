import { userProfileApi } from "@/services/authApi";
import SidebarWrapper from "./_components/SidebarWrapper";
import AuthProvider from "@/provider/AuthProvider";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) { 
     const user = await userProfileApi();
      if (!user) {
        redirect("/signin");
      }
    return (
      <AuthProvider user={user}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </AuthProvider>
    );
}