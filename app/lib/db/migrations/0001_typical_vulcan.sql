CREATE TABLE "Builds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Builds" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "BuildRequirements" (
	"build_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "BuildRequirements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "BuildRequirements" ADD CONSTRAINT "BuildRequirements_build_id_Builds_id_fk" FOREIGN KEY ("build_id") REFERENCES "public"."Builds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "BuildRequirements" ADD CONSTRAINT "BuildRequirements_item_id_Items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."Items"("id") ON DELETE no action ON UPDATE no action;