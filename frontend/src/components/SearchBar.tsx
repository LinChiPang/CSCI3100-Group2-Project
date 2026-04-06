import { useEffect, useRef, useState } from "react";
import { getSearchSuggestions } from "../services/api";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (overrideValue?: string) => void;
};

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced suggestions fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(value);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectSuggestion(s: string) {
    onChange(s);
    setSuggestions([]);
    setShowDropdown(false);
    onSubmit(s); // pass value directly — avoids stale closure in parent
  }

  function handleSubmit() {
    setShowDropdown(false);
    onSubmit();
  }

  return (
    <div ref={containerRef} className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-900" htmlFor="search">
        Search
      </label>
      <div className="relative mt-2">
        <input
          id="search"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
          placeholder="Search title, category, seller..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
            if (e.key === "Escape") setShowDropdown(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowDropdown(true);
          }}
          autoComplete="off"
        />
        {showDropdown && suggestions.length > 0 && (
          <ul
            id="search-suggestions"
            className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg"
          >
            {suggestions.map((s) => (
              <li
                key={s}
                onMouseDown={(e) => {
                  // prevent input blur before click registers
                  e.preventDefault();
                  selectSuggestion(s);
                }}
                className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-gray-100"
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-3 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
      >
        Search
      </button>
    </div>
  );
}

