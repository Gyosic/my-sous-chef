import { Check, X } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@repo/ui/shared/form/FormItemWrapper";
import { TemplateFormItemProps } from "@repo/ui/shared/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

export function TextField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  fieldState,
  isForm = true,
  className,
  labelPosition = "top",
  labelCls,
  isDuplicate = true,
  onDuplicateCheck,
}: TemplateFormItemProps<T, K>) {
  return (
    <>
      <FormItemWrapper
        name={fieldModel.name}
        desc={fieldModel.desc}
        isForm={isForm}
        className={cn(className, labelPosition === "left" ? "flex flex-1 items-center" : "flex-1")}
        labelCls={labelCls}
        icon={fieldModel.icon}
        fieldState={fieldState}
      >
        <div className="flex w-full items-center gap-2">
          <div className="relative flex w-full items-center gap-2">
            <Input
              readOnly={fieldModel.readOnly}
              placeholder={fieldModel?.placeholder ?? `입력하세요.`}
              {...field}
              value={field?.value ?? ""}
              onBlur={() => {
                field.onBlur();
                // fieldModel?.onBlur?.({ getValues, setError, clearErrors });
              }}
            />
            {!!field.value && (
              <Button
                variant="ghost"
                type="button"
                className="absolute top-0 right-0 hover:bg-transparent hover:text-destructive"
                onClick={() => field.onChange(undefined)}
              >
                <X />
              </Button>
            )}
          </div>
          {!!fieldModel?.unique && (
            <Button
              variant="outline"
              type="button"
              disabled={!field.value || !isDuplicate}
              onClick={() => onDuplicateCheck?.(field.name, field.value)}
            >
              {!isDuplicate && <Check />} 중복검사
            </Button>
          )}
        </div>
      </FormItemWrapper>
    </>
  );
}
