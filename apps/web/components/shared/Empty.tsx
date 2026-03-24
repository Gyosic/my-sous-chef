"use client";

import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/components/button";
import { DOMAttributes } from "react";

const Empty = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        {children}
      </div>
    </div>
  );
};

const EmptyIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex size-20 items-center justify-center rounded-full bg-muted/50">
      {children}
    </div>
  );
};

const EmptyContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col items-center gap-2">{children}</div>;
};

interface EmptyRedirectButtonProps extends DOMAttributes<HTMLButtonElement> {
  redirect?: string;
}
const EmptyRedirectButton = ({
  redirect,
  ...props
}: EmptyRedirectButtonProps) => {
  const router = useRouter();
  const handleClick = () => {
    if (redirect) router.push(redirect);
    else router.back();
  };

  return (
    <Button
      {...props}
      className="h-11 gap-1.5 rounded-full px-6"
      onClick={handleClick}
    >
      {props.children}
    </Button>
  );
};

export { Empty, EmptyIcon, EmptyContent, EmptyRedirectButton };
