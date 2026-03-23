import { auth } from "@/lib/auth";
import { Appbar } from "@/components/shared/Appbar";
import { BottomNav } from "@/components/shared/BottomNav";
import { SessionProvider } from "next-auth/react";
import BaseurlProvider from "@/components/provider/BaseurlProvider";
import { api } from "@/config";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <SessionProvider>
      <BaseurlProvider baseurl={api.baseurl}>
        <div className="flex h-svh flex-col bg-white">
          <Appbar user={user} />
          <main className="relative flex-1 overflow-y-auto">{children}</main>
          <BottomNav isLoggedIn={!!user} />
        </div>
      </BaseurlProvider>
    </SessionProvider>
  );
}
