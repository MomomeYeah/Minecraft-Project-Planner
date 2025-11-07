"use client";

import { use } from "react";
import { SelectBuild } from "@/app/lib/db/schema/builds";
import { updateBuild, BuildState } from "@/app/lib/actions";
import BaseForm from "./base-form"

export default function Form({buildPromise}: {buildPromise: Promise<SelectBuild>}) {
    const build = use(buildPromise);
    const initialState: BuildState = {fields: {
        name: build.name,
        description: build.description,
        requirements: build.requirements ?? [],
    }};
        
    return <BaseForm
                initialState={initialState}
                formAction={updateBuild.bind(null, build.id)}
            />
}