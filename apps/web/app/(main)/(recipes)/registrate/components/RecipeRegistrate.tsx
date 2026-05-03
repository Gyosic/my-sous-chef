"use client";

import {
  FieldModel,
  TemplateFormItem,
} from "@/components/form/TemplateFormItem";
import { BaseurlContext } from "@/components/provider/BaseurlProvider";
import { Loading } from "@/components/shared/Loading";
import { TopBar } from "@/components/shared/TopBar";
import { zodResolver } from "@hookform/resolvers/zod";
import { type RecipeInput, recipeSchema } from "@repo/db/types/recipes";
import { Button } from "@repo/ui/components/button";
import { FieldGroup } from "@repo/ui/components/field";
import { toast } from "@repo/ui/components/sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export function RecipeRegistrate() {
  const router = useRouter();
  const { baseurl } = useContext(BaseurlContext);
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(false);

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
      try {
        setLoading(true);
        const res = await fetch(new URL("/api/recipes", baseurl), {
          method: "POST",
          body: JSON.stringify(inputs),
          headers: {
            Authorization: `Bearer ${sessionData?.user.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) toast.error("[오류]", { description: await res.text() });
        else {
          toast.success("레피시를 등록했습니다.");
          router.push("/recipes");
        }
      } catch (err) {
        toast.error("[오류]", { description: (err as Error)?.message ?? "" });
      } finally {
        setLoading(false);
      }
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

      {loading && (
        <Loading>
          <div className="flex flex-col items-center gap-2">
            <p className="text-[17px] font-semibold text-foreground">
              레시피를 등록하는 중 입니다.
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
