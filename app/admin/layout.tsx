import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/supabase-server";
import { isUserSuperAdmin } from "@/lib/admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getServerUser();

  if (!user) {
    redirect("/login");
  }

  const isSuperAdmin = await isUserSuperAdmin(user.id);

  if (!isSuperAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar userEmail={user.email || ""} />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
