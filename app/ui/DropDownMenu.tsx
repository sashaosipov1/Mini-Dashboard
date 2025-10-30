"use client"

import { Button } from "@radix-ui/themes";
import { ChevronDown } from "lucide-react";
import { DropdownMenu } from "radix-ui";



export default function DropDown() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <Button variant="soft">
                    Statuses
                    <ChevronDown />
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="z-50 min-w-[8rem] rounded-md border bg-white p-1 shadow-md"
                >
                    <DropdownMenu.Item
                        className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                    >True</DropdownMenu.Item>
                    <DropdownMenu.Item
                        className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                    >False</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item
                        className="px-2 py-1.5 text-sm hover:bg-gray-100 cursor-pointer"
                    >Clear</DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}