"use client";

import {
  FieldModel,
  TemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { Loading } from "@/components/shared/Loading";
import { TopBar } from "@/components/shared/TopBar";
import { actionFetch, getLocalStorage, setLocalStorage } from "@/lib/api";
import { RecipeState, useRecipeStore } from "@/lib/store/use-recipes-store";
import { extractErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RecipeInput, recipeSchema } from "@repo/db/types/recipes";
import { Button } from "@repo/ui/components/button";
import { FieldGroup } from "@repo/ui/components/field";
import { toast } from "@repo/ui/components/sonner";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

export function RecipeRegistrate() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { baseurl } = useContext(BaseurlContext);
  const { data: sessionData } = useSession();

  const { currentRecipe } = useRecipeStore();

  const editId = searchParams.get("id");
  const isEdit = !!editId;

  // currentRecipe 우선(수정 버튼 클릭 시 set됨), 없으면 localStorage 폴백
  const initialValues = useMemo(() => {
    if (!isEdit) return null;
    if (currentRecipe?.id === editId) return currentRecipe;
    const stored = getLocalStorage("recipes") as RecipeState[] | undefined;
    return stored?.find((r) => r.id === editId) ?? null;
  }, [editId, isEdit, currentRecipe]);

  const defaultValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(recipeSchema.shape).map(([key, { meta }]) => [
          key,
          initialValues
            ? (initialValues as Record<string, unknown>)[key]
            : meta?.()?.default,
        ]),
      ),
    [initialValues],
  );

  const form = useForm<RecipeInput>({
    resolver: zodResolver(recipeSchema),
    mode: "onSubmit",
    defaultValues,
  });
  const { handleSubmit } = form;

  const { mutate, isPending } = useMutation({
    mutationFn: async (inputs: RecipeInput) => {
      if (sessionData) {
        if (isEdit) {
          await actionFetch(new URL(`/api/recipes/${editId}`, baseurl), {
            method: "PATCH",
            body: JSON.stringify(inputs),
            headers: {
              Authorization: `Bearer ${sessionData.user.access_token}`,
              "Content-Type": "application/json",
            },
          });
        } else {
          await actionFetch(new URL("/api/recipes", baseurl), {
            method: "POST",
            body: JSON.stringify(inputs),
            headers: {
              Authorization: `Bearer ${sessionData.user.access_token}`,
              "Content-Type": "application/json",
            },
          });
        }
      } else {
        const stored = (getLocalStorage("recipes") as RecipeState[]) || [];
        if (isEdit && editId) {
          const updated = stored.map((r) =>
            r.id === editId ? { ...r, ...inputs } : r,
          );
          setLocalStorage("recipes", updated);
        } else {
          setLocalStorage("recipes", [
            ...stored,
            { ...inputs, id: crypto.randomUUID() },
          ]);
        }
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "레시피를 수정했습니다." : "레시피를 등록했습니다.",
      );
      router.push("/");
    },
    onError: (err) => {
      toast.error(
        extractErrorMessage(
          err,
          isEdit
            ? "레시피 수정에 실패했습니다."
            : "레시피 등록에 실패했습니다.",
        ),
      );
    },
  });

  const onSubmit = handleSubmit(
    async (inputs) => mutate(inputs),
    (invalid) => console.info(invalid, form.control._fields),
  );

  return (
    <form onSubmit={onSubmit}>
      <TopBar title={isEdit ? "레시피 수정" : "레시피 등록"}>
        <Button variant="ghost">저장</Button>
      </TopBar>
      <FieldGroup className="px-8 py-4">
        {Object.entries(recipeSchema.shape).map(([key, { meta }]) => {
          if (!meta()) return null;
          if (key === "share" && !sessionData) return null;
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
            />
          );
        })}
        <Button>저장</Button>
      </FieldGroup>

      {isPending && (
        <Loading>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[17px] font-semibold text-foreground">
              {isEdit
                ? "레시피를 수정하는 중 입니다."
                : "레시피를 등록하는 중 입니다."}
            </p>
            <p className="text-[13px] text-muted-foreground">
              레시피가 등록되면 요리 보조를 받을 수 있습니다.
            </p>
          </div>
        </Loading>
      )}
    </form>
  );
}
