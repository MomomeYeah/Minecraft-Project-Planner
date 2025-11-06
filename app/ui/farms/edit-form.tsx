"use client";

import { use } from "react";
import { SelectFarm } from "@/app/lib/db/schema/farms";
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
import { updateFarm, FarmState } from "@/app/lib/actions";
import BaseForm from "./base-form"

export default function Form({farmPromise, farmCategoriesPromise}: {farmPromise: Promise<SelectFarm>, farmCategoriesPromise: Promise<Array<SelectFarmCategory>>}) {
    const farm = use(farmPromise);
    const farmCategories = use(farmCategoriesPromise);
    
    const initialState: FarmState = {fields: {
        name: farm.name,
        farm_category_id: farm.farm_category_id,
        time_to_build_mins: farm.time_to_build_mins,
        automation_level: farm.automation_level,
        reference_url: farm.reference_url,
        requirements: farm.requirements ?? [],
        outputs: farm.outputs ?? [],
    }};
        
    return <BaseForm
                farmCategories={farmCategories}
                initialState={initialState}
                formAction={updateFarm.bind(null, farm.id)}
            />
}