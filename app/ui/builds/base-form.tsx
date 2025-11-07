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
    FieldGroup,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton";

import { BuildState, RelatedItemFields } from "@/app/lib/actions";
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
    initialState: BuildState,
    formAction: (prevState: BuildState, formData: FormData) => Promise<BuildState>,
}
export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.formAction, props.initialState);
    const [items, setItems] = useState<Array<RelatedItemFields>>(props.initialState.fields.requirements);

    useEffect(() => {
        setItems(state.fields.requirements);
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
                                placeholder="My Build"
                                defaultValue={state.fields?.name?.toString()}
                                errors={state.errors?.properties?.name?.errors}
                            />
                            <FormInput
                                id="description"
                                name="description"
                                label="Description"
                                defaultValue={state.fields?.description?.toString()}
                                errors={state.errors?.properties?.description?.errors}
                            />
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <RelatedItemsForm
                        sectionHeading="Required Items"
                        items={items}
                        setItems={setItems}
                        errors={state.errors?.properties?.requirements}
                    />
                    <FieldSeparator />
                    <FieldSet>
                        <Field orientation="horizontal">
                            <Button type="submit" className="cursor-pointer">Submit</Button>
                            <Button variant="outline" type="button" asChild>
                                <Link href="/builds">Cancel</Link>
                            </Button>
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </form>
        </>
    );
}