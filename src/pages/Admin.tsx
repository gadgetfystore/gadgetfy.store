import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';

const Admin = () => {
  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <SidebarProvider>
        <div className="flex min-h-[calc(100vh-64px)] w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <SidebarTrigger className="mb-4" />
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Admin;
