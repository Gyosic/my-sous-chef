ALTER TABLE "recipes" ADD COLUMN "source" "recipe_source" DEFAULT 'original' NOT NULL;--> statement-breakpoint
ALTER TABLE "recipes" ADD COLUMN "forked_from_id" text;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_forked_from_id_recipes_id_fk" FOREIGN KEY ("forked_from_id") REFERENCES "public"."recipes"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" DROP COLUMN "type";