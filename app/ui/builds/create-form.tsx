"use client";

import { useActionState } from "react"
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import Link from "next/link";
import { createBuild, BuildState } from "@/app/lib/actions";

export default function Form() {
    const initialState: BuildState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createBuild, initialState);

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
                <Field data-invalid={!!state.errors?.name}>
                    <FieldLabel htmlFor="name">
                        Name
                    </FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        placeholder="My Build"
                        aria-invalid={!!state.errors?.name}
                    />
                    {state.errors?.name && <FieldError>{state.errors.name.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.description}>
                    <FieldLabel htmlFor="description">
                        Description
                    </FieldLabel>
                    <Input
                        id="description"
                        name="description"
                        aria-invalid={!!state.errors?.description}
                    />
                    {state.errors?.description && <FieldError>{state.errors.description.join(", ")}</FieldError>}
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit" className="cursor-pointer">Submit</Button>
                    <Button variant="outline" type="button" asChild>
                        <Link href="/builds">Cancel</Link>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
        </>
    );
}