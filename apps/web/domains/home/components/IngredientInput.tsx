"use client";

import { type RecommendInput } from "@repo/db/types/recommend";
import { FieldGroup } from "@repo/ui/components/field";
import { Controller, UseFormReturn } from "react-hook-form";
import { TemplateFormItem } from "@/components/form/TemplateFormItem";

const recommandModel = {
  ingredients: {
    name: "재료",
    type: "tag",
    placeholder: "재료명을 입력하세요",
  },
};

interface IngredientInputProps {
  form: UseFormReturn<RecommendInput>;
}

export function IngredientInput({ form }: IngredientInputProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Input Row */}
      <div className="flex gap-2">
        <FieldGroup>
          {Object.entries(recommandModel).map(([key, fieldModel]) => (
            <Controller
              key={key}
              name={key as keyof RecommendInput}
              control={form.control}
              render={({ field, fieldState }) => (
                <TemplateFormItem
                  field={field}
                  fieldState={fieldState}
                  fieldModel={fieldModel}
                  labelCls="hidden"
                />
              )}
            ></Controller>
          ))}
        </FieldGroup>
      </div>
    </div>
  );
}
