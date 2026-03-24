import { RecipeOutput } from "@repo/db/types/recipes";
import { create } from "zustand";

export type RecipeState = RecipeOutput & {
  id: string;
  type: string;
};

interface RecipeStore {
  recipes: RecipeState[];
  setRecipes: (recipes: RecipeState[]) => void;

  currentRecipe: RecipeState | null;
  setCurrentRecipe: (recipe: RecipeState | null) => void;
}

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),
  currentRecipe: null,
  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
}));
