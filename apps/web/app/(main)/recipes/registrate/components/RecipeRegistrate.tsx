"use client";

import {
  FieldModel,
  TemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeInput, recipeSchema } from "@repo/db/types/recipes";
import { FieldGroup } from "@repo/ui/components/field";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";

export function RecipeRegistrate() {
  const { baseurl } = useContext(BaseurlContext);
  const form = useForm({
    resolver: zodResolver(recipeSchema),
    mode: "onSubmit",
  });
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(async (inputs) => {});

  return (
    <form onSubmit={onSubmit} className="p-2">
      <FieldGroup>
        {Object.entries(recipeSchema.shape).map(([key, { meta }]) => {
          return (
            <Controller
              key={key}
              name={key as keyof RecipeInput}
              control={form.control}
              render={({ field, fieldState }) => (
                <TemplateFormItem
                  field={field}
                  fieldState={fieldState}
                  fieldModel={meta() as FieldModel}
                />
              )}
            ></Controller>
          );
        })}
      </FieldGroup>
    </form>
  );
}
