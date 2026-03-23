import { Check, Search, X } from "lucide-react";
import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { cn } from "@repo/ui/lib/utils";

export function TextField() {
  const {
    field,
    fieldModel,
    className,
    labelPosition = "top",
    isDuplicate = true,
    onDuplicateCheck,
  } = useTemplateFormItem();

  return (
    <>
      <FormItemWrapper
        className={cn(
          className,
          labelPosition === "left" ? "flex flex-1 items-center" : "flex-1",
        )}
      >
        <div className="flex w-full items-center gap-2">
          <div className="relative flex w-full items-center gap-2">
            <Search className="absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              readOnly={fieldModel.readOnly}
              placeholder={fieldModel?.placeholder ?? `입력하세요.`}
              className="h-11 rounded-[10px] pl-10"
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
