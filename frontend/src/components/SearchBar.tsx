type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: SearchBarProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <label className="block text-sm font-medium text-gray-900" htmlFor="search">
        Search
      </label>
      <input
        id="search"
        className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900"
        placeholder="Search title, category, seller..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />
      <button
        type="button"
        onClick={onSubmit}
        className="mt-3 w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
      >
        Search
      </button>
    </div>
  );
}

