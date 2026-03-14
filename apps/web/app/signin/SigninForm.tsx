"use client";

import { signIn } from "next-auth/react";
import { GoogleButton } from "@repo/ui/shared/GoogleButton";
import { NaverButton } from "@repo/ui/shared/NaverButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
// import { FieldModel } from "@/types";
import { useTheme } from "next-themes";

export function SigninForm() {
  const oauthSignin = async (provider: "google" | "naver") => {
    await signIn(provider);
  };

  const { theme } = useTheme();

  const naverImgSrc =
    theme === "dark"
      ? "/icons/naver-icon-dark.png"
      : "/icons/naver-icon-green.png";

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome!</CardTitle>
        <CardDescription>소셜 로그인으로 빠르게 시작하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleButton
          type="button"
          text="구글로 시작하기"
          variant="outline"
          onClick={() => oauthSignin("google")}
        />
        <NaverButton
          type="button"
          text="네이버로 시작하기"
          onClick={() => oauthSignin("naver")}
          buttonImg={naverImgSrc}
        />
      </CardContent>
    </Card>
  );
}
