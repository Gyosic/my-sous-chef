import { AiRecipe } from "@/ai/ai.interface";
import { RecipeInput } from "@repo/db/types/recipes";

export function buildPrompt(
  ingredients: string[],
  prompt: string,
  dishOptions: string[],
  cuisineOptions: string[],
): string {
  return `당신은 요리 전문가입니다. 사용자 요청에 맞는 레시피를 생성해줘야 합니다.
사용자가 가진 재료: ${ingredients.join(", ")}
${prompt ? `추가 요청: ${prompt}` : ""}

이 재료로 만들 수 있는 레시피 3개를 추천해주세요.
steps는 최대한 상세하게, 요리 초보자도 쉽게 따라할 수 있게 설명해주세요.
반드시 아래 JSON 형식으로만 응답하세요:
{
  "recipes": [
    {
      "name": "요리명",
      "description": "간단한 설명",
      "steps": [
        {
          "title": "1단계 타이틀",
          "description": "1단계 설명"
        },
        {
          "title": "2단계 타이틀",
          "description": "2단계 설명"
        }
      ],
      "ingredients": [
        {
          "name": "재료명",
          "amount": "필요한재료량",
          "optional": "선택사항(Boolean)"
        },
        {
          "name": "재료명",
          "amount": "필요한재료량",
          "optional": "선택사항(Boolean)"
        }
      ],
      "units": [
        {
          "name": "단위명칭(1큰술)",
          "unit": "계량단위(15ml)"
        },
        {
          "name": "단위명칭(1꼬집)",
          "unit": "계량단위(2g)"
        }
      ],
      "servings": "인분단위 분량(숫자만 소수점가능)",
      "source": "ai",
      "dishSlug: ${dishOptions.join(",")} 중 하나,
      "cuisineSlug는": ${cuisineOptions.join(",")} 중 하나
    }
  ]
}
`;
}

export function parseRecipe(
  text: string,
  dishCategories: Map<string, string>,
  cuisineCategories: Map<string, string>,
): RecipeInput[] {
  try {
    const parsed: { recipes: AiRecipe[] } = JSON.parse(text);
    const recipes = parsed.recipes.map((r) => {
      const { dishSlug, cuisineSlug, ...recipe } = r;
      const dishCategoryId = dishCategories.get(dishSlug);
      const cuisineCategoryId = cuisineCategories.get(cuisineSlug);

      return { ...recipe, dishCategoryId, cuisineCategoryId } as RecipeInput;
    });

    return recipes;
  } catch {
    return [];
  }
}
