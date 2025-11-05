CREATE TYPE "public"."ItemQuantityTypes" AS ENUM('Shulker Boxes', 'Stacks', 'Items');--> statement-breakpoint
ALTER TABLE "BuildRequirements" ADD COLUMN "quantity_type" "ItemQuantityTypes" NOT NULL;