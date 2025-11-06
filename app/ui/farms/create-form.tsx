"use client";

import { use } from "react";
import { createFarm, FarmState } from "@/app/lib/actions";
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
import BaseForm from "./base-form"

export default function Form({farmCategoriesPromise}: {farmCategoriesPromise: Promise<Array<SelectFarmCategory>>}) {
    const farmCategories = use(farmCategoriesPromise);
    const initialState: FarmState = {
        fields: {
            requirements: [],
            outputs: [],
        }
    };
    
    return <BaseForm
                farmCategories={farmCategories}
                initialState={initialState}
                formAction={createFarm}
            />
}