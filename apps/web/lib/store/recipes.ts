import { create } from "zustand";

export type RecipeState = {
  name: string;
  description: string;
  steps: string[];
  ingredients: string[];
  time: string;
  difficulty: string;
  matchRate: number;
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
