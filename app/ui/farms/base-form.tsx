"use client";

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { CircleAlert } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton";

import { FarmState, RelatedItemFields } from "@/app/lib/actions";
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
import FormInput from "@/app/ui/form-input";
import RelatedItemsForm from "@/app/ui/items/related-items-form";

export function FormSkeleton() {
    return (
        <>
            <Skeleton className="h-4 w-1/6 px-3 py-1 mb-1" />
            <Skeleton className="h-9 w-full px-3 py-1 mb-4" />
            
            <Skeleton className="h-4 w-1/6 px-3 py-1 mb-1" />
            <Skeleton className="h-9 w-full px-3 py-1 mb-4" />
            
            <Skeleton className="h-4 w-1/6 px-3 py-1 mb-1" />
            <Skeleton className="h-9 w-full px-3 py-1 mb-4" />
        </>
    );
}

type FormProps = {
    farmCategories: Array<SelectFarmCategory>,
    initialState: FarmState,
    formAction: (prevState: FarmState, formData: FormData) => Promise<FarmState>,
}
export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.formAction, props.initialState);
    const [requirements, setRequirements] = useState<Array<RelatedItemFields>>(props.initialState.fields.requirements);
    const [outputs, setOutputs] = useState<Array<RelatedItemFields>>(props.initialState.fields.outputs);

    useEffect(() => {
        setRequirements(state.fields.requirements);
        setOutputs(state.fields.outputs);
    }, [state]);

    return (
        <>
            {
                state.message && 
                <Alert variant="destructive" className="mb-6">
                    <CircleAlert />
                    <AlertTitle>{state.message}</AlertTitle>
                    <AlertDescription>
                        <p>Please fill out all required fields.</p>
                    </AlertDescription>
                </Alert>
            }
            <form action={formAction}>
                <FieldGroup>
                    <FieldSet>
                        <FieldGroup>
                            <FormInput
                                id="name"
                                name="name"
                                label="Name"
                                placeholder="My Farm"
                                defaultValue={state.fields?.name?.toString()}
                                errors={state.errors?.properties?.name?.errors}
                            />
                            <Field data-invalid={!!state.errors?.properties?.farm_category_id}>
                                <FieldLabel htmlFor="farm-category-id">
                                    Category
                                </FieldLabel>
                                <Select
                                    name="farm-category-id"
                                    defaultValue={state.fields?.farm_category_id?.toString()}
                                >
                                    <SelectTrigger
                                        id="farm-category-id"
                                        aria-invalid={!!state.errors?.properties?.farm_category_id}
                                    >
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {props.farmCategories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>{category.category_name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    state.errors?.properties?.farm_category_id &&
                                    <FieldError>
                                        {state.errors?.properties?.farm_category_id?.errors?.join(", ")}
                                    </FieldError>}
                            </Field>
                            <FormInput
                                id="time-to-build-mins"
                                name="time-to-build-mins"
                                label="Time to Build (Minutes)"
                                defaultValue={state.fields?.time_to_build_mins?.toString()}
                                errors={state.errors?.properties?.time_to_build_mins?.errors}
                            />
                            <Field data-invalid={!!state.errors?.properties?.automation_level}>
                                <FieldLabel htmlFor="automation-level">
                                    Automation Level
                                </FieldLabel>
                                <Select
                                    name="automation-level"
                                    defaultValue={state.fields?.automation_level?.toString()}
                                >
                                    <SelectTrigger
                                        id="automation-level"
                                        aria-invalid={!!state.errors?.properties?.automation_level}
                                    >
                                        <SelectValue placeholder="Automation Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Automatic">Automatic</SelectItem>
                                            <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                                            <SelectItem value="Manual">Manual</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    state.errors?.properties?.automation_level &&
                                    <FieldError>
                                        {state.errors?.properties?.automation_level?.errors?.join(", ")}
                                    </FieldError>}
                            </Field>
                            <FormInput
                                id="reference-url"
                                name="reference-url"
                                label="Reference"
                                defaultValue={state.fields?.reference_url?.toString()}
                                errors={state.errors?.properties?.reference_url?.errors}
                            />
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <RelatedItemsForm
                        sectionHeading="Required Items"
                        items={requirements}
                        setItems={setRequirements}
                        attributePrefix="requirement_"
                        errors={state.errors?.properties?.requirements}
                    />
                    <FieldSeparator />
                    <RelatedItemsForm
                        sectionHeading="Outputs"
                        items={outputs}
                        setItems={setOutputs}
                        attributePrefix="output_"
                        errors={state.errors?.properties?.outputs}
                    />
                    <FieldSeparator />
                    <FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" className="cursor-pointer">Submit</Button>
                            <Button variant="outline" type="button" asChild>
                                <Link href="/farms">Cancel</Link>
                            </Button>
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </form>
        </>
    );
}