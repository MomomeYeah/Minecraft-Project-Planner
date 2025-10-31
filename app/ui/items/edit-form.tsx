"use client";

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import Link from "next/link";
import { SelectItem } from "@/app/lib/db/schema/items";
import { updateItem, State } from "@/app/lib/actions";

export default function Form({item}: {item: SelectItem}) {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction] = useActionState(updateItem.bind(null, item.id), initialState);

    return (
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
                        defaultValue={item.name}
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
                        defaultValue={item.item_id}
                        aria-invalid={!!state.errors?.item_id}
                    />
                    {state.errors?.item_id && <FieldError>{state.errors.item_id.join(", ")}</FieldError>}
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">
                        <Link href="/items">Cancel</Link>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    );
}