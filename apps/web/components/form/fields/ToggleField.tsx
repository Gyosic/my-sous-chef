import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";
import { cn } from "@repo/ui/lib/utils";
import { Toggle } from "@repo/ui/components/toggle";
import { Square, SquareCheck } from "lucide-react";

export function ToggleField() {
  const {
    field,
    fieldModel,
    className,
    labelPosition = "top",
  } = useTemplateFormItem();

  return (
    <>
      <FormItemWrapper
        className={cn(
          className,
          labelPosition === "left" ? "flex flex-0 items-center" : "flex-0",
        )}
      >
        <div className="flex w-full items-center gap-2">
          <div className="relative flex items-center gap-2">
            <Toggle
              variant="outline"
              {...field}
              onPressedChange={(change) => field.onChange(change)}
            >
              {!field.value && <Square />}
              {field.value && <SquareCheck />}
              {fieldModel.placeholder}
            </Toggle>
          </div>
        </div>
      </FormItemWrapper>
    </>
  );
}
