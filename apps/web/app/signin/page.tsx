import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SigninForm } from "./SigninForm";

export default async function SigninPage() {
  // 이미 로그인되어 있으면 홈으로 리다이렉트
  const session = await auth();

  if (session) redirect("/");

  return <SigninForm />;
}
