ALTER TABLE "recipes" DROP CONSTRAINT "recipes_category_id_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "type" "category_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "dish_category_id" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "cuisine_category_id" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_dish_category_id_categories_id_fk" FOREIGN KEY ("dish_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_cuisine_category_id_categories_id_fk" FOREIGN KEY ("cuisine_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "category_id";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE("slug");