import { Dispatch, SetStateAction } from "react";
import { Trash } from "lucide-react"
import { RelatedItemFields, ZodTreeifiedError } from "@/app/lib/actions";
import ItemTable from "@/app/ui/items/table";
import FormInput from "@/app/ui/form-input";
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
    FieldLegend,
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

type RelatedItemsFormProps = {
    sectionHeading: string,
    items: Array<RelatedItemFields>,
    setItems: Dispatch<SetStateAction<Array<RelatedItemFields>>>,
    attributePrefix?: string
    errors: ZodTreeifiedError | undefined,
}
export default function RelatedItemsForm(props: RelatedItemsFormProps) {
    const attributePrefix = props.attributePrefix || "";

    function handleItemToggled(item_id: string, item_name: string, checked: boolean) {
        const newItems: Array<RelatedItemFields> = props.items.filter(item => item.item_id !== item_id);
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

        props.setItems(newItems);
    }

    function itemErrors(index: number, property: string): Array<string> | undefined {
        return props.errors?.items?.[index]?.properties?.[property]?.errors;
    }

    return (
        <FieldSet>
            <FieldLegend>{props.sectionHeading}</FieldLegend>
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
                        checked={props.items}
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
                props.items.map((item, index) => (
                    <div key={item.item_id?.toString()} className="flex items-start justify-between">
                        <div className="grid grid-cols-3 gap-4 grow">
                            <input type="hidden" name={`${attributePrefix}item_id`} value={item.item_id?.toString()} />
                            <input type="hidden" name={`${attributePrefix}item_name`} value={item.item_name?.toString()} />
                            {item.item_name?.toString()}
                            <FormInput
                                name={`${attributePrefix}item_quantity`}
                                placeholder="Quantity"
                                defaultValue={item.quantity?.toString()}
                                errors={itemErrors(index, "quantity")}
                            />
                            <Field data-invalid={!!itemErrors(index, "quantity_type")}>
                                <Select
                                    name={`${attributePrefix}item_quantity_type`}
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
    )
}