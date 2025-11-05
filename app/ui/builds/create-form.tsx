"use client";

import { createBuild, BuildState } from "@/app/lib/actions";
import BaseForm from "./base-form"

export default function Form() {
    const initialState: BuildState = {
        fields: {
            name: "",
            description: "",
            requirements: []
        }
    };
    
    return <BaseForm
                initialState={initialState}
                formAction={createBuild}
            />
}