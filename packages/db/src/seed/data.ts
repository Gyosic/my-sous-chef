import type { categories } from "../schema/categories";
import type { InferInsertModel } from "drizzle-orm";

type CategoryInsert = InferInsertModel<typeof categories>;

export const CATEGORY_SEED: CategoryInsert[] = [
  // 종류 (dish)
  { type: "dish", slug: "main-side", name: "메인반찬" },
  { type: "dish", slug: "side-dish", name: "밑반찬" },
  { type: "dish", slug: "soup", name: "국/탕" },
  { type: "dish", slug: "stew", name: "찌개" },
  { type: "dish", slug: "noodle", name: "면" },
  { type: "dish", slug: "rice", name: "밥/죽/떡" },
  { type: "dish", slug: "dessert", name: "디저트" },
  { type: "dish", slug: "salad", name: "샐러드" },
  { type: "dish", slug: "bread", name: "빵" },
  { type: "dish", slug: "sauce", name: "양념/소스/잼" },
  { type: "dish", slug: "kimchi", name: "김치/젓갈/장류" },
  { type: "dish", slug: "drink", name: "차/음료/술" },

  // 국가 (cuisine)
  { type: "cuisine", slug: "korean", name: "한식" },
  { type: "cuisine", slug: "western", name: "양식" },
  { type: "cuisine", slug: "japanese", name: "일식" },
  { type: "cuisine", slug: "chinese", name: "중식" },
  { type: "cuisine", slug: "asian", name: "아시안" },
  { type: "cuisine", slug: "fusion", name: "퓨전" },
];
