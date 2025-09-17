type SearchResultsSummaryProps = {
  count: number;
  searchTerm: string;
};

export function SearchResultsSummary({ count, searchTerm }: SearchResultsSummaryProps) {
  return (
    <div className="text-center py-4">
      <p className="text-gray-600">
        Showing {count} advocates
        {searchTerm && ` matching "${searchTerm}"`}
      </p>
    </div>
  );
}
