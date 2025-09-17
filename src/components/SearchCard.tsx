import { ChangeEvent } from "react";

type SearchCardProps = {
  searchTerm: string;
  isSearching: boolean;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
};

export function SearchCard({
  searchTerm,
  isSearching,
  onSearchChange,
  onReset,
}: SearchCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Search Our Network of Advocates
        </h2>
        <p className="text-gray-600">
          Find the perfect advocate by name, location, specialty, or experience level
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Search by name, city, degree, or specialty..."
            className="w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-lg"
            aria-describedby="search-help"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-600 border-t-transparent"></div>
            </div>
          )}
        </div>
        <button
          onClick={onReset}
          className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium border border-gray-300"
          aria-label="Clear search and show all advocates"
        >
          Clear Search
        </button>
      </div>

      {searchTerm && (
        <div
          id="search-help"
          className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg"
        >
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-emerald-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-emerald-800">
              Searching for: <span className="font-semibold">{searchTerm}</span>
              {isSearching && <span className="ml-2">(searching...)</span>}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
