import { create } from "zustand";

export type RecipeState = {
  id: string;
  name: string;
  description: string;
  steps: { title: string; description: string }[];
  ingredients: { name: string; amount: string; optional: boolean }[];
  units: { name: string; unit: string }[];
  servings: number;
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

// 테스트 완료 후 제거
// const dummyRecipe = {
//   name: "돼지고기 고추장 볶음",
//   description: "매콤달콤한 고추장 소스로 돼지고기와 양파를 볶아내는 기본 반찬.",
//   steps: [
//     {
//       title: "1단계 재료 손질하기",
//       description:
//         "양파 1개와 대파 1대는 깨끗이 손질한 후, 양파는 채 썰고 대파는 어슷썰기 합니다. 돼지고기는 먹기 좋은 크기로 잘라줍니다.",
//     },
//     {
//       title: "2단계 양념장 만들기",
//       description:
//         "큰 볼에 고추장 2큰술, 설탕 1큰술, 다진 대파 반을 넣고 잘 섞어 양념장을 만듭니다.",
//     },
//     {
//       title: "3단계 볶기",
//       description:
//         "팬에 식용유 1큰술을 두르고 중불에서 대파 반 나머지와 양파를 2분간 볶습니다. 돼지고기를 넣고 고기가 익을 때까지 5분간 볶습니다.",
//     },
//     {
//       title: "4단계 양념장 넣고 볶기",
//       description:
//         "미리 만든 양념장을 팬에 넣고 재료와 골고루 섞이도록 3분간 볶아 마무리 합니다.",
//     },
//   ],
//   ingredients: [
//     {
//       name: "양파",
//       amount: "1개",
//       optional: false,
//     },
//     {
//       name: "대파",
//       amount: "1대",
//       optional: false,
//     },
//     {
//       name: "돼지고기",
//       amount: "200g",
//       optional: false,
//     },
//     {
//       name: "고추장",
//       amount: "2큰술",
//       optional: false,
//     },
//     {
//       name: "설탕",
//       amount: "1큰술",
//       optional: false,
//     },
//   ],
//   units: [
//     {
//       name: "큰술",
//       unit: "15ml",
//     },
//   ],
//   servings: 2,
//   time: "20분",
//   difficulty: "쉬움",
//   matchRate: 100,
// };

export const useRecipeStore = create<RecipeStore>((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),
  currentRecipe: null,
  setCurrentRecipe: (recipe) => set({ currentRecipe: recipe }),
}));
