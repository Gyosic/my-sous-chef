import { X } from "lucide-react";
import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { useTemplateFormItem } from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";

export function NumberField() {
  const {
    field,
    fieldModel,
    className,
    labelPosition = "top",
    inputCls,
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
            <InputGroup className={cn(inputCls)}>
              <InputGroupInput
                readOnly={fieldModel.readOnly}
                placeholder={fieldModel?.placeholder ?? `숫자 입력`}
                {...field}
                type="number"
                step={fieldModel?.step}
                value={field?.value ?? ""}
                className=""
                onBlur={() => {
                  field.onBlur();
                  // fieldModel?.onBlur?.({ getValues, setError, clearErrors });
                }}
              />
              {!!field.value && (
                <InputGroupAddon align="inline-end">
                  {" "}
                  <Button
                    variant="ghost"
                    type="button"
                    className="hover:bg-transparent hover:text-destructive"
                    onClick={() => field.onChange(undefined)}
                  >
                    <X />
                  </Button>
                </InputGroupAddon>
              )}
            </InputGroup>
          </div>
        </div>
      </FormItemWrapper>
    </>
  );
}
