"use client";

import { createFarm, FarmState } from "@/app/lib/actions";
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
import BaseForm from "./base-form"

export default function Form({farmCategories}: {farmCategories: Array<SelectFarmCategory>}) {
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