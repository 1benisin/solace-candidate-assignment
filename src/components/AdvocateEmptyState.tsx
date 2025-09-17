type AdvocateEmptyStateProps = {
  searchTerm: string;
};

export function AdvocateEmptyState({ searchTerm }: AdvocateEmptyStateProps) {
  const hasSearchTerm = Boolean(searchTerm);

  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
      <div className="mx-auto w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-emerald-400"
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
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {hasSearchTerm ? "No advocates found" : "No advocates available"}
      </h3>
      <p className="text-gray-600 max-w-md mx-auto">
        {hasSearchTerm
          ? "Try adjusting your search terms or clear the search to see all advocates."
          : "There are currently no advocates in the system."}
      </p>
    </div>
  );
}
