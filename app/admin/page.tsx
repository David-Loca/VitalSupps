import { redirect } from "next/navigation";
import { verifyAdminSession } from "@/lib/admin/auth";

export default async function AdminIndexPage() {
  const isAuthenticated = await verifyAdminSession();

  if (isAuthenticated) {
    redirect("/admin/dashboard/");
  }

  redirect("/admin/login/");
}
