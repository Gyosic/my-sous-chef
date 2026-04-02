"use client";

import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ingredientSchema,
  type IngredientInput,
} from "@repo/db/types/ingredients";
import {
  FieldModel,
  TemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { Button } from "@repo/ui/components/button";
import { FieldGroup } from "@repo/ui/components/field";
import { toast } from "@repo/ui/components/sonner";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@repo/ui/components/drawer";
import type { Ingredient } from "@/app/(main)/fridge/hooks/use-ingredients";

interface IngredientDrawerProps {
  ingredient: Ingredient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (body: IngredientInput) => Promise<unknown>;
  onUpdate: (id: string, body: IngredientInput) => Promise<unknown>;
  onRemove: (id: string) => Promise<unknown>;
}

const defaultValues = Object.fromEntries(
  Object.entries(ingredientSchema.shape).map(([key, { meta }]) => [
    key,
    meta?.()?.default,
  ]),
);

export function IngredientDrawer({
  ingredient,
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  onRemove,
}: IngredientDrawerProps) {
  const isEdit = !!ingredient;
  const [submitting, setSubmitting] = useState(false);
  const [removing, setRemoving] = useState(false);

  const form = useForm<IngredientInput>({
    resolver: zodResolver(ingredientSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (!open) return;
    if (ingredient) {
      form.reset({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
        expiration: ingredient.expiration
          ? new Date(ingredient.expiration)
          : undefined,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [ingredient, open]);

  const { handleSubmit } = form;

  const onSubmit = handleSubmit(
    async (inputs) => {
      setSubmitting(true);
      try {
        if (isEdit) {
          await onUpdate(ingredient.id, inputs);
          toast.success(`${inputs.name}을(를) 수정했습니다.`);
        } else {
          await onAdd(inputs);
          toast.success(`${inputs.name}을(를) 추가했습니다.`);
        }
        onOpenChange(false);
      } catch {
        // hook의 onError에서 toast 처리
      } finally {
        setSubmitting(false);
      }
    },
    (invalid) => console.info(invalid),
  );

  const handleRemove = async () => {
    if (!ingredient) return;
    setRemoving(true);
    try {
      await onRemove(ingredient.id);
      toast.success(`${ingredient.name}을(를) 삭제했습니다.`);
      onOpenChange(false);
    } catch {
      // hook의 onError에서 toast 처리
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{isEdit ? "재료 수정" : "재료 추가"}</DrawerTitle>
          <DrawerDescription>
            {isEdit ? "재료 정보를 수정하세요" : "새로운 재료를 추가하세요"}
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 px-4 pb-6">
          <FieldGroup>
            {Object.entries(ingredientSchema.shape).map(([key, { meta }]) => (
              <Controller
                key={key}
                name={key as keyof IngredientInput}
                control={form.control}
                render={({ field, fieldState }) => (
                  <TemplateFormItem
                    field={field}
                    fieldState={fieldState}
                    fieldModel={meta() as FieldModel}
                    inputCls="bg-neutral-100 border-0"
                  />
                )}
              />
            ))}
          </FieldGroup>
          <div className="flex gap-2">
            {isEdit ? (
              <Button
                type="button"
                variant="destructive"
                className="flex-1"
                onClick={handleRemove}
                disabled={removing || submitting}
              >
                {removing ? "삭제 중..." : "삭제"}
              </Button>
            ) : (
              <Button
                type="button"
                variant="ghost"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || removing}
            >
              {submitting ? "저장 중..." : isEdit ? "저장" : "추가"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
