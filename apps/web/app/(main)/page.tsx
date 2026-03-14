import { auth } from "@/lib/auth";
import { HomeContent } from "./HomeContent";

export default async function Home() {
  const session = await auth();
  const userName = session?.user?.name ?? null;

  return <HomeContent userName={userName} />;
}
