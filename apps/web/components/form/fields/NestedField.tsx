import { Trash2 } from "lucide-react";
import { FormItemWrapper } from "@/components/form/FormItemWrapper";
import {
  FieldModel,
  TemplateFormItem,
  useTemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { useEffect, useState } from "react";
import { FieldLabel } from "@repo/ui/components/field";
import { ZodObject } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export function NestedField() {
  const {
    field,
    fieldModel,
    className,
    labelPosition = "top",
    inputCls,
  } = useTemplateFormItem();
  const schema = fieldModel.nestedSchema as ZodObject;

  type NestedItem = { _id: string; data: Record<string, unknown> };
  const [nested, setNested] = useState<NestedItem[]>([]);

  const getDefaultData = () =>
    Object.fromEntries(
      Object.entries(schema.shape).map(([key, { meta }]) => [
        key,
        meta()?.default,
      ]),
    );

  const newItem = (data?: Record<string, unknown>): NestedItem => ({
    _id: crypto.randomUUID(),
    data: data ?? getDefaultData(),
  });

  const handleAddItem = () => {
    setNested((prev) => [...prev, newItem()]);
  };

  const handleRemoveItem = (id: string) => {
    const updated = nested.filter((item) => item._id !== id);
    setNested(updated);
    field.onChange(updated.map((item) => item.data));
  };

  const handleItemChange = (id: string, data: Record<string, unknown>) => {
    const updated = nested.map((item) =>
      item._id === id ? { ...item, data } : item,
    );
    setNested(updated);
    field.onChange(updated.map((item) => item.data));
  };

  useEffect(() => {
    if (field.value?.length)
      setNested(field.value.map((v: Record<string, unknown>) => newItem(v)));
    else {
      if (fieldModel.required) setNested([newItem()]);
    }
  }, []);

  return (
    <FormItemWrapper
      className={cn(
        className,
        labelPosition === "left" ? "flex flex-1 items-center" : "flex-1",
      )}
      formLabel={
        <div className="flex justify-between items-center">
          <FieldLabel>{fieldModel.name}</FieldLabel>
          <Button type="button" variant="ghost" onClick={handleAddItem}>
            + 추가
          </Button>
        </div>
      }
    >
      <div className="flex flex-col w-full items-center gap-2">
        {nested.map((item) => (
          <NestedRow
            key={item._id}
            schema={schema}
            item={item.data}
            inputCls={inputCls}
            direction={fieldModel?.nestedDirection as string}
            onChange={(updated) => handleItemChange(item._id, updated)}
            onRemove={() => handleRemoveItem(item._id)}
          />
        ))}
      </div>
    </FormItemWrapper>
  );
}

function NestedRow({
  schema,
  item,
  direction,
  onChange,
  onRemove,
  inputCls,
}: {
  schema: ZodObject;
  item: Record<string, unknown>;
  direction?: string;
  inputCls?: string;
  onChange: (item: Record<string, unknown>) => void;
  onRemove: () => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: item,
  });

  // 내부 폼 값이 바뀌면 검증 후 부모에 알림
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (isValid) onChange(values as Record<string, unknown>);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  return (
    <div className="relative flex w-full gap-2">
      <div
        className={cn(
          direction === "horizon" ? "flex flex-col" : "flex",
          "relative w-full gap-2",
        )}
      >
        {Object.entries(schema.shape).map(([key, { meta }]) => (
          <Controller
            key={key}
            name={key}
            control={form.control}
            render={({ field, fieldState }) => (
              <TemplateFormItem
                field={field}
                fieldState={fieldState}
                fieldModel={meta() as FieldModel}
                labelCls="hidden"
                inputCls={inputCls}
              />
            )}
          />
        ))}
      </div>
      <Button type="button" variant="ghost" onClick={onRemove}>
        <Trash2 />
      </Button>
    </div>
  );
}
