"use client";

import { createElement } from "react";

import { useDynamicIcon } from "@repo/ui/hooks/use-lucide-icon";
import { cn } from "@repo/ui/lib/utils";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@repo/ui/components/field";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";

interface FormItemWrapperProps {
  className?: string;
  formLabel?: React.ReactNode;
}

export function FormItemWrapper({
  children,
  className,
  formLabel,
}: FormItemWrapperProps & { children: React.ReactNode }) {
  const {
    isForm = true,
    fieldModel,
    fieldState,
    labelCls,
  } = useTemplateFormItem();

  const iconComponent = useDynamicIcon(fieldModel.icon);

  if (!isForm) return <>{children}</>;

  return (
    <Field className={cn(className)}>
      {formLabel ? (
        formLabel
      ) : (
        <FieldLabel className={cn(labelCls)}>
          {iconComponent &&
            createElement(iconComponent, { className: "size-4" })}{" "}
          {fieldModel.name}
        </FieldLabel>
      )}
      {children}
      {fieldModel.desc && (
        <FieldDescription className="text-gray-500 text-xs">
          {fieldModel.desc}
        </FieldDescription>
      )}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
