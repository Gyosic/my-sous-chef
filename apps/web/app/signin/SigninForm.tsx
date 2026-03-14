"use client";

import { signIn } from "next-auth/react";
import { GoogleButton } from "@repo/ui/shared/GoogleButton";
import { NaverButton } from "@repo/ui/shared/NaverButton";
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
    <div className="flex min-h-svh flex-col bg-white dark:bg-neutral-950">
      {/* Top Spacer */}
      <div className="h-[180px] shrink-0" />

      {/* Brand Section */}
      <div className="flex flex-col items-center gap-5 px-6">
        <div className="size-14 rounded-[14px] bg-neutral-900" />
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-[26px] font-bold text-neutral-950 dark:text-neutral-50">
            Welcome
          </h1>
          <p className="text-sm text-neutral-500">로그인하고 시작해보세요</p>
        </div>
      </div>

      {/* Mid Spacer */}
      <div className="h-12 shrink-0" />

      {/* Button Section */}
      <div className="flex flex-col gap-3 px-6">
        <GoogleButton
          text="Google로 계속하기"
          variant="outline"
          className="h-11 w-full rounded-[10px] border-neutral-200 text-sm font-medium"
          onClick={() => oauthSignin("google")}
        />

        {/* Or Divider */}
        <div className="flex items-center gap-4 py-0.5">
          <div className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs text-neutral-400">또는</span>
          <div className="h-px flex-1 bg-neutral-200" />
        </div>

        <NaverButton
          text="네이버로 계속하기"
          className="h-11 w-full rounded-[10px] text-sm font-medium"
          onClick={() => oauthSignin("naver")}
          buttonImg={naverImgSrc}
        />
      </div>

      {/* Bottom Fill */}
      <div className="min-h-px flex-1" />

      {/* Footer */}
      <div className="px-6 pb-10 text-center">
        <p className="text-[11px] text-neutral-400">
          계속 진행하면{" "}
          <span className="font-medium text-neutral-500">이용약관</span> 및{" "}
          <span className="font-medium text-neutral-500">
            개인정보 처리방침
          </span>
          에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
