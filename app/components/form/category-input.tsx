import { useMemo, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";

import { Field, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

type CategoryInputProps = {
  defaultValues?: string[];
  allCategories?: string[];
};

export function CategoryInput({
  defaultValues = [],
  allCategories = [],
}: CategoryInputProps) {
  const [categories, setCategories] = useState<string[]>(defaultValues);
  const [input, setInput] = useState("");

  function addCategory(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) return;
    setCategories([...categories, trimmed]);
    setInput("");
  }

  function removeCategory(value: string) {
    setCategories(categories.filter((c) => c !== value));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(input);
    } else if (e.key === "Backspace" && input === "" && categories.length > 0) {
      e.preventDefault();
      setCategories(categories.slice(0, -1));
    }
  }

  const suggestions = useMemo(() => {
    const lowered = input.trim().toLowerCase();
    return allCategories
      .filter((c) => !categories.includes(c))
      .filter((c) => lowered === "" || c.toLowerCase().includes(lowered))
      .slice(0, 8);
  }, [allCategories, categories, input]);

  return (
    <Field>
      <FieldLabel htmlFor="categories-input">Categories</FieldLabel>
      {categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(cat)}
                aria-label={`Remove ${cat}`}
                className="-mr-1 rounded-full p-0.5 hover:bg-foreground/10"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <Input
        id="categories-input"
        type="text"
        placeholder="Add a category and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {suggestions.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Suggestions:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addCategory(s)}
              className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10 hover:bg-foreground/10"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}
      {categories.map((c) => (
        <input key={c} type="hidden" name="categories" value={c} />
      ))}
    </Field>
  );
}
