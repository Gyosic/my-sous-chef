"use client";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

export function PasswordField() {
  const {
    field,
    fieldModel,
    className,
    labelPosition = "top",
  } = useTemplateFormItem();
  const [visiblePassword, setVisiblePassword] = useState<boolean>(false);

  return (
    <FormItemWrapper
      className={cn(
        className,
        labelPosition === "left" ? "flex flex-1 items-center" : "flex-1",
      )}
    >
      <div className="relative flex w-full items-center gap-2">
        <Input
          type={visiblePassword ? "text" : "password"}
          placeholder={fieldModel?.placeholder ?? `입력하세요.`}
          {...field}
          value={field?.value ?? ""}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hover:bg-[#4fc3f7]/30"
          onClick={() => setVisiblePassword((prev) => !prev)}
        >
          {visiblePassword ? <Eye /> : <EyeClosed />}
        </Button>
      </div>
    </FormItemWrapper>
  );
}
