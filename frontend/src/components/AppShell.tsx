import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { WalletConnectButton } from "@/components/WalletConnectButton";
import { MobileNav } from "@/components/MobileNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

export function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {!isMobile && <AppSidebar />}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Gradient accent bar */}
          <div className="h-0.5 bg-gradient-to-r from-primary via-primary/60 to-accent shrink-0" />
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-card/80 backdrop-blur-sm px-4">
            <div className="flex items-center gap-2">
              {!isMobile && <SidebarTrigger />}
              {isMobile && (
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-xs">
                    TL
                  </div>
                  <span className="font-semibold text-base">TipLedger</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <WalletConnectButton />
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-[1440px]">{children}</div>
          </main>
          {isMobile && <MobileNav />}
        </div>
      </div>
    </SidebarProvider>
  );
}
