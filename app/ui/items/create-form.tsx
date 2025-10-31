import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import Link from "next/link";
import { createItem } from "@/app/lib/actions";

export default function Form() {
    return (
        <form action={createItem}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="item-name">
                        Item Name
                    </FieldLabel>
                    <Input
                        id="item-name"
                        name="item-name"
                        placeholder="My Item"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="item-id">
                        Item ID
                    </FieldLabel>
                    <Input
                        id="item-id"
                        name="item-id"
                        placeholder="minecraft:my_item"
                        required
                    />
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