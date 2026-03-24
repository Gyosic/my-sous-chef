"use client";

import {
  FieldModel,
  TemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { TopBar } from "@/components/shared/TopBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RecipeInput, recipeSchema } from "@repo/db/types/recipes";
import { Button } from "@repo/ui/components/button";
import { FieldGroup } from "@repo/ui/components/field";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";

export function RecipeRegistrate() {
  const { baseurl } = useContext(BaseurlContext);

  const form = useForm<RecipeInput>({
    resolver: zodResolver(recipeSchema),
    mode: "onSubmit",
    defaultValues: Object.fromEntries(
      Object.entries(recipeSchema.shape).map(([key, { meta }]) => [
        key,
        meta?.()?.default,
      ]),
    ),
  });
  const { handleSubmit } = form;
  const onSubmit = handleSubmit(
    async (inputs) => {
      console.info(baseurl, inputs);
    },
    (invalid) => console.info(invalid, form.control._fields),
  );

  return (
    <form onSubmit={onSubmit}>
      <TopBar title="레시피 등록">
        <Button variant="ghost">저장</Button>
      </TopBar>
      <FieldGroup className="px-8 py-4">
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
                  inputCls="bg-neutral-100 border-0"
                />
              )}
            ></Controller>
          );
        })}
        <Button>저장</Button>
      </FieldGroup>
    </form>
  );
}
