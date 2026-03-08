"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import {
    searchLanguages,
    getLanguageDisplayName,
} from "@typix-editor/extension-code-block";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "../../../primitives/popover";
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "../../../primitives/command";

interface LanguageSelectorProps {
    nodeKey: string;
    language: string;
    onSelect: (lang: string) => void;
}

export function LanguageSelector({
    language,
    onSelect,
}: LanguageSelectorProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (lang: string) => {
        onSelect(lang);
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                    {getLanguageDisplayName(language)}
                    <ChevronDown className="size-3 opacity-60" />
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" sideOffset={6} className="w-52 p-0">
                <Command>
                    <CommandInput placeholder="Search for a language..." />
                    <CommandList>
                        <CommandEmpty>No languages found</CommandEmpty>
                        <CommandGroup>
                            {searchLanguages("").map(({ key, label }) => (
                                <CommandItem
                                    key={key}
                                    value={`${key} ${label}`}
                                    onSelect={() => handleSelect(key)}
                                    className="justify-between"
                                >
                                    <span>{label}</span>
                                    {key === language && (
                                        <Check className="size-3 text-primary" />
                                    )}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
