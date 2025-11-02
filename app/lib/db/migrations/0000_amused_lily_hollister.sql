CREATE TYPE "public"."automation_level" AS ENUM('Automatic', 'Semi-Automatic', 'Manual');--> statement-breakpoint
CREATE TABLE "FarmCategories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FarmCategories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Farms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"farm_category_id" uuid NOT NULL,
	"time_to_build_mins" integer NOT NULL,
	"automation_level" "automation_level" NOT NULL,
	"reference_url" text
);
--> statement-breakpoint
ALTER TABLE "Farms" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "FarmDrops" (
	"farm_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity_per_hour" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FarmDrops" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"item_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "Users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "Farms" ADD CONSTRAINT "Farms_farm_category_id_FarmCategories_id_fk" FOREIGN KEY ("farm_category_id") REFERENCES "public"."FarmCategories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FarmDrops" ADD CONSTRAINT "FarmDrops_farm_id_Farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."Farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FarmDrops" ADD CONSTRAINT "FarmDrops_item_id_Items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."Items"("id") ON DELETE no action ON UPDATE no action;