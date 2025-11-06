CREATE TABLE "FarmOutputs" (
	"farm_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"quantity_type" "ItemQuantityTypes" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FarmOutputs" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "FarmRequirements" (
	"farm_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"quantity_type" "ItemQuantityTypes" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "FarmRequirements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "FarmDrops" CASCADE;--> statement-breakpoint
ALTER TABLE "FarmOutputs" ADD CONSTRAINT "FarmOutputs_farm_id_Farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."Farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FarmOutputs" ADD CONSTRAINT "FarmOutputs_item_id_Items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."Items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FarmRequirements" ADD CONSTRAINT "FarmRequirements_farm_id_Farms_id_fk" FOREIGN KEY ("farm_id") REFERENCES "public"."Farms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "FarmRequirements" ADD CONSTRAINT "FarmRequirements_item_id_Items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."Items"("id") ON DELETE no action ON UPDATE no action;