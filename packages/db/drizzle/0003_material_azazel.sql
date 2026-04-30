ALTER TABLE "ingredients" ADD COLUMN "purchase_date" date;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "category_id" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "like" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;