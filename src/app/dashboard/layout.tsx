import { Sidebar } from '@/components/Sidebar'; 
// DO NOT import globals.css here. It is already loaded in the root layout.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* The Sidebar is strictly loaded here only */}
      <Sidebar />
      
      {/* Offsets main content by the sidebar width (w-64) */}
      <div className="pl-64">
        <main className="py-8 px-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}