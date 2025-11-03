"use client";

import { useActionState } from "react"
import { CircleAlert } from "lucide-react"
import { SelectFarmCategory } from "@/app/lib/db/schema/farm-categories";
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import Link from "next/link";
import { createFarm, FarmState } from "@/app/lib/actions";

export default function Form({farmCategories}: {farmCategories: Array<SelectFarmCategory>}) {
    const initialState: FarmState = { message: null, errors: {} };
    const [state, formAction] = useActionState(createFarm, initialState);

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
                        placeholder="My Farm"
                        aria-invalid={!!state.errors?.name}
                    />
                    {state.errors?.name && <FieldError>{state.errors.name.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.farm_category_id}>
                    <FieldLabel htmlFor="farm-category-id">
                        Category
                    </FieldLabel>
                    <Select
                        name="farm-category-id"
                        aria-invalid={!!state.errors?.farm_category_id}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {farmCategories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>{category.category_name}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {state.errors?.farm_category_id && <FieldError>{state.errors.farm_category_id.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.time_to_build_mins}>
                    <FieldLabel htmlFor="time-to-build-mins">
                        Time to Build (Minutes)
                    </FieldLabel>
                    <Input
                        id="time-to-build-mins"
                        name="time-to-build-mins"
                        aria-invalid={!!state.errors?.time_to_build_mins}
                    />
                    {state.errors?.time_to_build_mins && <FieldError>{state.errors.time_to_build_mins.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.automation_level}>
                    <FieldLabel htmlFor="automation-level">
                        Automation Level
                    </FieldLabel>
                    <Select
                        name="automation-level"
                        aria-invalid={!!state.errors?.automation_level}
                    >
                        <SelectTrigger>
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
                    {state.errors?.automation_level && <FieldError>{state.errors.automation_level.join(", ")}</FieldError>}
                </Field>
                <Field data-invalid={!!state.errors?.reference_url}>
                    <FieldLabel htmlFor="reference-url">
                        Reference
                    </FieldLabel>
                    <Input
                        id="reference-url"
                        name="reference-url"
                        aria-invalid={!!state.errors?.reference_url}
                    />
                    {state.errors?.reference_url && <FieldError>{state.errors.reference_url.join(", ")}</FieldError>}
                </Field>
                <Field orientation="horizontal">
                    <Button type="submit" className="cursor-pointer">Submit</Button>
                    <Button variant="outline" type="button" asChild>
                        <Link href="/farms">Cancel</Link>
                    </Button>
                </Field>
            </FieldGroup>
        </form>
        </>
    );
}