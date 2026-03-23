import { auth } from "@/lib/auth";
import { Appbar } from "@/components/shared/Appbar";
import { BottomNav } from "@/components/shared/BottomNav";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user ?? null;

  return (
    <div className="flex h-svh flex-col bg-white">
      <Appbar user={user} />
      <main className="relative flex-1 overflow-y-auto">{children}</main>
      <BottomNav isLoggedIn={!!user} />
    </div>
  );
}
