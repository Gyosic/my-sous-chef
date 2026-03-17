import { Plus, Search, X } from "lucide-react";
import { FieldPath, FieldValues } from "react-hook-form";
import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import { TemplateFormItemProps } from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { useState } from "react";
import { Badge } from "@repo/ui/components/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";

export function TagField<T extends FieldValues, K extends FieldPath<T>>({
  fieldModel,
  field,
  fieldState,
  isForm = true,
  className,
  labelPosition = "top",
  labelCls,
}: TemplateFormItemProps<T, K>) {
  const [inputValue, setInputValue] = useState("");

  const addBucket = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !field.value.includes(trimmed)) {
      setInputValue("");
      field.onChange([...field.value, trimmed]);
    }
  };

  const removeBucket = (item: string) => {
    const filtered = field.value.filter((i) => i !== item);
    field.onChange(filtered);
  };

  return (
    <>
      <FormItemWrapper
        name={fieldModel.name}
        desc={fieldModel.desc}
        isForm={isForm}
        className={cn(
          className,
          labelPosition === "left" ? "flex flex-1 items-center" : "flex-1",
        )}
        labelCls={labelCls}
        icon={fieldModel.icon}
        fieldState={fieldState}
      >
        <div className="flex flex-col w-full gap-2">
          <div className="relative flex w-full items-center gap-2">
            <InputGroup className="h-11 rounded-[10px]">
              <InputGroupInput
                readOnly={fieldModel.readOnly}
                placeholder={fieldModel?.placeholder ?? `입력하세요.`}
                {...field}
                value={inputValue}
                onBlur={() => {
                  field.onBlur();
                }}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBucket();
                  }
                }}
              />
              <InputGroupAddon>
                <Search className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>

            <Button
              type="button"
              size="icon"
              onClick={addBucket}
              className="size-11 rounded-[10px]"
            >
              <Plus className="size-5" />
            </Button>
          </div>

          {field.value.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                {field.value.map((item) => (
                  <Badge
                    key={item}
                    variant="secondary"
                    className="h-8.5 cursor-pointer gap-1.5 rounded-full px-3 text-[13px] font-medium"
                    onClick={() => removeBucket(item)}
                  >
                    {item}
                    <X className="size-3.5 text-muted-foreground" />
                  </Badge>
                ))}
              </div>
            </>
          )}
        </div>
      </FormItemWrapper>
    </>
  );
}
