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
import { createItem, ItemState } from "@/app/lib/actions";

export default function Form() {
    const initialState: ItemState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createItem, initialState);

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
                    <FieldLabel htmlFor="item-name">
                        Item Name
                    </FieldLabel>
                    <Input
                        id="item-name"
                        name="item-name"
                        placeholder="My Item"
                        aria-invalid={!!state.errors?.name}
                    />
                    {state.errors?.name && <FieldError>{state.errors.name.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.item_id}>
                    <FieldLabel htmlFor="item-id">
                        Item ID
                    </FieldLabel>
                    <Input
                        id="item-id"
                        name="item-id"
                        placeholder="minecraft:my_item"
                        aria-invalid={!!state.errors?.item_id}
                    />
                    {state.errors?.item_id && <FieldError>{state.errors.item_id.join(", ")}</FieldError>}
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit" className="cursor-pointer">Submit</Button>
                    <Button variant="outline" type="button" asChild>
                        <Link href="/items">Cancel</Link>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
        </>
    );
}