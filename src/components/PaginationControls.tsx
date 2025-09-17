import { PaginationInfo } from "../types/advocate";

type PaginationControlsProps = {
  pagination: PaginationInfo;
  searchTerm: string;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function PaginationControls({
  pagination,
  searchTerm,
  currentPage,
  onPageChange,
}: PaginationControlsProps) {
  const start = (pagination.page - 1) * pagination.limit + 1;
  const end = Math.min(pagination.page * pagination.limit, pagination.total);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p className="text-gray-600">
          Showing {start} to {end} of {pagination.total} advocates
          {searchTerm && ` matching "${searchTerm}"`}
        </p>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-1"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Previous</span>
          </button>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <span className="text-sm text-emerald-800 font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-1"
          >
            <span>Next</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
