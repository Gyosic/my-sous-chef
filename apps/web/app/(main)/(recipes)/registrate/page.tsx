import { RecipeRegistrate } from "@/app/(main)/(recipes)/registrate/components/RecipeRegistrate";
import { Suspense } from "react";

export default function RecipeRegistratePage() {
  return (
    <Suspense>
      <RecipeRegistrate />
    </Suspense>
  );
}
