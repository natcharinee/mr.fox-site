import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminLoginPage from "./login-client";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <AdminLoginPage />;
}
