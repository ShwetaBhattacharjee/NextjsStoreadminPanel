"use client";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface MultiSelectProps {
  placeholder: string;
  collections: CollectionType[]; // List of collections
  onsales: OnSaleType[]; // List of onsales
  value: string[]; // Currently selected ids (could be collection/onsale ids)
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  collections = [], // Default to an empty array if collections is undefined
  onsales = [], // Default to an empty array if onsales is undefined
  value,
  onChange,
  onRemove,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Identify whether a selected ID corresponds to a collection or onsale
  let selected: (CollectionType | OnSaleType)[] = [];

  if (value.length === 0) {
    selected = [];
  } else {
    selected = value
      .map(
        (id) =>
          collections.find((collection) => collection._id === id) ||
          onsales.find((onsale) => onsale._id === id)
      )
      .filter(Boolean) as (CollectionType | OnSaleType)[]; // Filter out undefined results
  }

  // Get selectable collections and onsales that aren't already selected
  const selectables = [
    ...collections.filter((collection) => !selected.includes(collection)),
    ...onsales.filter((onsale) => !selected.includes(onsale)),
  ];

  return (
    <Command className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {/* Display selected items as badges */}
        {selected.map((item) => (
          <Badge key={item._id}>
            {item.title}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(item._id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        {/* Command Input to search for collections and onsales */}
        <CommandInput
          placeholder={placeholder}
          value={inputValue}
          onValueChange={setInputValue}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <CommandGroup className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {/* Show selectable items (collections + onsales) */}
            {selectables.map((item) => (
              <CommandItem
                key={item._id}
                onMouseDown={(e) => e.preventDefault()}
                onSelect={() => {
                  onChange(item._id); // Select the item and add to the value
                  setInputValue(""); // Reset the input field
                }}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </div>
    </Command>
  );
};

export default MultiSelect;
