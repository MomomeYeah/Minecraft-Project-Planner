"use client";

import { useActionState, useEffect, useState } from "react"
import Link from "next/link"
import { CircleAlert, Trash } from "lucide-react"

import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/ui/dialog';
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { BuildState, BuildRequirementFields } from "@/app/lib/actions";
import ItemTable from "@/app/ui/items/table";

type FormProps = {
    initialState: BuildState,
    formAction: (prevState: BuildState, formData: FormData) => Promise<BuildState>,
}
export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.formAction, props.initialState);
    const [items, setItems] = useState<Array<BuildRequirementFields>>(props.initialState.fields.requirements);

    useEffect(() => {
        setItems(state.fields.requirements);
    }, [state]);

    function handleItemToggled(item_id: string, item_name: string, checked: boolean) {
        const newItems: Array<BuildRequirementFields> = items.filter(item => item.item_id !== item_id);
        if (checked) {
            newItems.push({
                item_id: item_id,
                item_name: item_name,
                quantity: null,
                quantity_type: null,
            });
        }

        newItems.sort((a, b) => {
            if (a.item_name > b.item_name) {
                return 1;
            } else if (a.item_name < b.item_name) {
                return -1;
            } else {
                return 0;
            }
        });

        setItems(newItems);
    }

    function itemErrors(index: number, property: string): Array<string> | undefined {
        return state.errors?.properties?.requirements?.items?.[index]?.properties?.[property]?.errors;
    }

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
                            <Field data-invalid={!!state.errors?.properties?.name}>
                                <FieldLabel htmlFor="name">
                                    Name
                                </FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="My Build"
                                    defaultValue={state.fields?.name?.toString()}
                                    aria-invalid={!!state.errors?.properties?.name}
                                />
                                {
                                    state.errors?.properties?.name &&
                                    <FieldError>
                                        {state.errors?.properties?.name?.errors?.join(", ")}
                                    </FieldError>
                                }
                            </Field>
                            <Field data-invalid={!!state.errors?.properties?.description}>
                                <FieldLabel htmlFor="description">
                                    Description
                                </FieldLabel>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={state.fields?.description?.toString()}
                                    aria-invalid={!!state.errors?.properties?.description}
                                />
                                {
                                    state.errors?.properties?.description &&
                                    <FieldError>
                                        {state.errors.properties?.description.errors?.join(", ")}
                                    </FieldError>
                                }
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Required Items</FieldLegend>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Select Items</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add items</DialogTitle>
                                    <DialogDescription>
                                        Add items to your build.
                                    </DialogDescription>
                                </DialogHeader>
                                <ItemTable
                                    checked={items}
                                    handleItemToggled={handleItemToggled}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {
                            items.map((item, index) => (
                                <div key={item.item_id?.toString()} className="flex items-start justify-between">
                                    <div className="grid grid-cols-3 gap-4 grow items-center">
                                        <input type="hidden" name="item_id" value={item.item_id?.toString()} />
                                        <input type="hidden" name="item_name" value={item.item_name?.toString()} />
                                        {item.item_name?.toString()}
                                        <Field data-invalid={!!itemErrors(index, "quantity")}>
                                            <Input
                                                name="item_quantity"
                                                placeholder="Quantity"
                                                defaultValue={item.quantity?.toString()}
                                                aria-invalid={!!itemErrors(index, "quantity")}
                                            />
                                            {
                                                !!itemErrors(index, "quantity") &&
                                                <FieldError>
                                                    {itemErrors(index, "quantity")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                        <Field data-invalid={!!itemErrors(index, "quantity_type")}>
                                            <Select
                                                name="item_quantity_type"
                                                defaultValue={item.quantity_type?.toString()}
                                            >
                                                <SelectTrigger aria-invalid={!!itemErrors(index, "quantity_type")}>
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="Shulker Boxes">Shulker Boxes</SelectItem>
                                                        <SelectItem value="Stacks">Stacks</SelectItem>
                                                        <SelectItem value="Items">Items</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                            {
                                                !!itemErrors(index, "quantity_type") &&
                                                <FieldError>
                                                    {itemErrors(index, "quantity_type")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        className="ml-4"
                                        onClick={() => handleItemToggled(item.item_id.toString(), item.item_name.toString(), false)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))
                        }
                    </FieldSet>
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