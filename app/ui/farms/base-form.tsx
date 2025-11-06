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

import { FarmState, FarmItemFields } from "@/app/lib/actions";
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
import ItemTable from "@/app/ui/items/table";

type FormProps = {
    farmCategories: Array<SelectFarmCategory>,
    initialState: FarmState,
    formAction: (prevState: FarmState, formData: FormData) => Promise<FarmState>,
}
export default function Form(props: FormProps) {
    const [state, formAction] = useActionState(props.formAction, props.initialState);
    const [requirements, setRequirements] = useState<Array<FarmItemFields>>(props.initialState.fields.requirements);
    const [outputs, setOutputs] = useState<Array<FarmItemFields>>(props.initialState.fields.outputs);

    useEffect(() => {
        setRequirements(state.fields.requirements);
        setOutputs(state.fields.outputs);
    }, [state]);

    function handleRequirementToggled(item_id: string, item_name: string, checked: boolean) {
        const newItems: Array<FarmItemFields> = requirements.filter(requirement => requirement.item_id !== item_id);
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

        setRequirements(newItems);
    }

    function handleOutputToggled(item_id: string, item_name: string, checked: boolean) {
        const newItems: Array<FarmItemFields> = outputs.filter(output => output.item_id !== item_id);
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

        setOutputs(newItems);
    }

    function requirementErrors(index: number, property: string): Array<string> | undefined {
        return state.errors?.properties?.requirements?.items?.[index]?.properties?.[property]?.errors;
    }

    function outputErrors(index: number, property: string): Array<string> | undefined {
        return state.errors?.properties?.outputs?.items?.[index]?.properties?.[property]?.errors;
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
                                    placeholder="My Farm"
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
                            <Field data-invalid={!!state.errors?.properties?.time_to_build_mins}>
                                <FieldLabel htmlFor="time-to-build-mins">
                                    Time to Build (Minutes)
                                </FieldLabel>
                                <Input
                                    id="time-to-build-mins"
                                    name="time-to-build-mins"
                                    defaultValue={state.fields?.time_to_build_mins?.toString()}
                                    aria-invalid={!!state.errors?.properties?.time_to_build_mins}
                                />
                                {
                                    state.errors?.properties?.time_to_build_mins &&
                                    <FieldError>
                                        {state.errors?.properties?.time_to_build_mins?.errors?.join(", ")}
                                    </FieldError>}
                            </Field>
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
                            <Field data-invalid={!!state.errors?.properties?.reference_url}>
                                <FieldLabel htmlFor="reference-url">
                                    Reference
                                </FieldLabel>
                                <Input
                                    id="reference-url"
                                    name="reference-url"
                                    defaultValue={state.fields?.reference_url?.toString()}
                                    aria-invalid={!!state.errors?.properties?.reference_url}
                                />
                                {
                                    state.errors?.properties?.reference_url &&
                                    <FieldError>
                                        {state.errors?.properties?.reference_url?.errors?.join(", ")}
                                    </FieldError>}
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
                                        Add items to your farm.
                                    </DialogDescription>
                                </DialogHeader>
                                <ItemTable
                                    checked={requirements}
                                    handleItemToggled={handleRequirementToggled}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {
                            requirements.map((item, index) => (
                                <div key={item.item_id?.toString()} className="flex items-start justify-between">
                                    <div className="grid grid-cols-3 gap-4 grow">
                                        <input type="hidden" name="requirement_item_id" value={item.item_id?.toString()} />
                                        <input type="hidden" name="requirement_item_name" value={item.item_name?.toString()} />
                                        {item.item_name?.toString()}
                                        <Field data-invalid={!!requirementErrors(index, "quantity")}>
                                            <Input
                                                name="requirement_item_quantity"
                                                placeholder="Quantity"
                                                defaultValue={item.quantity?.toString()}
                                                aria-invalid={!!requirementErrors(index, "quantity")}
                                            />
                                            {
                                                !!requirementErrors(index, "quantity") &&
                                                <FieldError>
                                                    {requirementErrors(index, "quantity")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                        <Field data-invalid={!!requirementErrors(index, "quantity_type")}>
                                            <Select
                                                name="requirement_item_quantity_type"
                                                defaultValue={item.quantity_type?.toString()}
                                            >
                                                <SelectTrigger aria-invalid={!!requirementErrors(index, "quantity_type")}>
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
                                                !!requirementErrors(index, "quantity_type") &&
                                                <FieldError>
                                                    {requirementErrors(index, "quantity_type")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        className="ml-4"
                                        onClick={() => handleRequirementToggled(item.item_id.toString(), item.item_name.toString(), false)}
                                    >
                                        <Trash />
                                    </Button>
                                </div>
                            ))
                        }
                    </FieldSet>
                    <FieldSeparator />
                    <FieldSet>
                        <FieldLegend>Outputs</FieldLegend>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Select Items</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Add items</DialogTitle>
                                    <DialogDescription>
                                        Add items to your farm.
                                    </DialogDescription>
                                </DialogHeader>
                                <ItemTable
                                    checked={outputs}
                                    handleItemToggled={handleOutputToggled}
                                />
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Close</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        {
                            outputs.map((item, index) => (
                                <div key={item.item_id?.toString()} className="flex items-start justify-between">
                                    <div className="grid grid-cols-3 gap-4 grow">
                                        <input type="hidden" name="output_item_id" value={item.item_id?.toString()} />
                                        <input type="hidden" name="output_item_name" value={item.item_name?.toString()} />
                                        {item.item_name?.toString()}
                                        <Field data-invalid={!!outputErrors(index, "quantity")}>
                                            <Input
                                                name="output_item_quantity"
                                                placeholder="Quantity"
                                                defaultValue={item.quantity?.toString()}
                                                aria-invalid={!!outputErrors(index, "quantity")}
                                            />
                                            {
                                                !!outputErrors(index, "quantity") &&
                                                <FieldError>
                                                    {outputErrors(index, "quantity")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                        <Field data-invalid={!!outputErrors(index, "quantity_type")}>
                                            <Select
                                                name="output_item_quantity_type"
                                                defaultValue={item.quantity_type?.toString()}
                                            >
                                                <SelectTrigger aria-invalid={!!outputErrors(index, "quantity_type")}>
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
                                                !!outputErrors(index, "quantity_type") &&
                                                <FieldError>
                                                    {outputErrors(index, "quantity_type")?.join(", ")}
                                                </FieldError>
                                            }
                                        </Field>
                                    </div>
                                    <Button
                                        type="button"
                                        variant={"outline"}
                                        className="ml-4"
                                        onClick={() => handleOutputToggled(item.item_id.toString(), item.item_name.toString(), false)}
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
                                <Link href="/farms">Cancel</Link>
                            </Button>
                        </Field>
                    </FieldSet>
                </FieldGroup>
            </form>
        </>
    );
}