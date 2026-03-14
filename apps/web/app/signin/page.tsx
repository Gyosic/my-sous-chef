import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SigninForm } from "./SigninForm";

export default async function SigninPage() {
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  const session = await auth();

  if (session) redirect("/");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex  flex-col gap-6">
        <SigninForm />
      </div>
    </div>
  );
}
