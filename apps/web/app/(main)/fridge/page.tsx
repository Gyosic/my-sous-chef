import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FridgeContent } from "@/app/(main)/fridge/components/FridgeContent";

export default async function FridgePage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  return <FridgeContent />;
}
