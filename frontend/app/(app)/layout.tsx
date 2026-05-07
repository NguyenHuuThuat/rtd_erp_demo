import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { DemoBanner } from '@/components/demo-banner';
import { AiAssistant } from '@/components/ai-assistant';
import { CommandPalette } from '@/components/command-palette';
import { TourGuide } from '@/components/tour-guide';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen">
        <DemoBanner />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Topbar />
            <main className="flex-1 p-6 max-w-screen-2xl w-full mx-auto">
              <Breadcrumbs />
              {children}
            </main>
          </div>
        </div>
      </div>
      <AiAssistant />
      <CommandPalette />
      <TourGuide />
    </AuthGuard>
  );
}
