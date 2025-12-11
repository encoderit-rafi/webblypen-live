import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/base/AppSidebar";
import Navbar from "@/components/base/Navbar";
import { Metadata } from "next";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="w-full overflow-hidden flex">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <div className="flex-1 overflow-hidden flex flex-col p-2">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
export const metadata: Metadata = {
  title: "Wobbly Pan | Dashboard",
  description: "Dashboard page with React Hook Form and React Query",
};
