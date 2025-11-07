import {
    Field,
    FieldError,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type FormInputProps = {
    id?: string,
    name: string,
    label?: string,
    placeholder?: string,
    defaultValue: string | undefined,
    errors: Array<string> | undefined,
}
export default function FormInput(props: FormInputProps) {
    const showLabel: boolean = !!props.label && !!props.id;

    return (
        <Field data-invalid={!!props.errors}>
            {
                showLabel &&
                <FieldLabel htmlFor={props.id}>
                    {props.label}
                </FieldLabel>
            }
            <Input
                id={props.id}
                name={props.name}
                placeholder={props.placeholder}
                defaultValue={props.defaultValue}
                aria-invalid={!!props.errors}
            />
            {
                !!props.errors &&
                <FieldError>
                    {props.errors.join(", ")}
                </FieldError>
            }
        </Field>
    )
}