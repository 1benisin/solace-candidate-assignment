"use client";

import { useEffect, useState, useCallback } from "react";
import { Advocate, AdvocatesResponse, PaginationInfo } from "../types/advocate";
import { formatPhoneNumber } from "../utils/phone";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedAdvocateId, setExpandedAdvocateId] = useState<number | null>(
    null
  );

  const fetchAdvocates = useCallback(
    async (
      search: string = "",
      page: number = 1,
      isInitialLoad: boolean = false
    ) => {
      try {
        // Only show full loading screen on initial load, not during search
        if (isInitialLoad) {
          setLoading(true);
        }
        setError(null);

        const params = new URLSearchParams({
          search,
          page: page.toString(),
          limit: "20",
        });

        const response = await fetch(`/api/advocates?${params}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const jsonResponse: AdvocatesResponse<Advocate> = await response.json();
        setAdvocates(jsonResponse.data);
        if (jsonResponse.pagination) {
          setPagination(jsonResponse.pagination);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch advocates"
        );
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    fetchAdvocates("", 1, true);
  }, [fetchAdvocates]);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchValue: string) => {
      setIsSearching(true);

      // Sanitize input to prevent XSS (script injection)
      const sanitizedValue = searchValue.replace(/[<>]/g, "");

      // Reset to first page when searching
      setCurrentPage(1);
      await fetchAdvocates(sanitizedValue, 1);
      setIsSearching(false);
    },
    [fetchAdvocates]
  );

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      await debouncedSearch(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchAdvocates("", 1, false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAdvocates(searchTerm, page, false);
  };

  const handleSpecialtiesExpand = (advocateId: number) => {
    // If clicking on already expanded advocate, collapse it
    // Otherwise, expand the clicked advocate (this also collapses any other expanded one)
    setExpandedAdvocateId(
      expandedAdvocateId === advocateId ? null : advocateId
    );
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <div className="text-lg text-gray-600">Loading advocates...</div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h2 className="font-bold">Error loading advocates</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Solace Advocates
        </h1>
        <p className="text-gray-600">Find the right advocate for your needs</p>
      </header>

      <div className="mb-8">
        <label
          htmlFor="search-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Search Advocates
        </label>
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
          <div className="relative flex-1">
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by name, city, degree, or specialty..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              aria-describedby="search-help"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
          <button
            onClick={handleResetSearch}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
            aria-label="Clear search and show all advocates"
          >
            Reset Search
          </button>
        </div>
        <div id="search-help" className="mt-2 text-sm text-gray-600">
          {searchTerm ? (
            <>
              Searching for: <span className="font-medium">{searchTerm}</span>
              {isSearching && <span className="ml-2">(searching...)</span>}
            </>
          ) : (
            "Enter search terms to filter advocates by name, location, degree, or specialty"
          )}
        </div>
      </div>

      {advocates.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? "No advocates found" : "No advocates available"}
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms or clear the search to see all advocates."
              : "There are currently no advocates in the system."}
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table
              className="min-w-full divide-y divide-gray-200"
              role="table"
              aria-label="Advocates directory"
            >
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Degree
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Specialties
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {advocates.map((advocate) => (
                  <tr
                    key={advocate.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="text-sm font-medium text-gray-900">
                          {advocate.firstName} {advocate.lastName}
                        </div>
                        <div className="text-sm text-gray-500 sm:hidden">
                          {advocate.city} • {advocate.degree}
                        </div>
                        <div className="text-xs text-gray-400 sm:hidden mt-1">
                          {advocate.yearsOfExperience} years experience
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                      {advocate.city}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {advocate.degree}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(expandedAdvocateId === advocate.id
                          ? advocate.specialties
                          : advocate.specialties.slice(0, 2)
                        ).map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                          </span>
                        ))}
                        {advocate.specialties.length > 2 && (
                          <span
                            onClick={() => handleSpecialtiesExpand(advocate.id)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 cursor-pointer hover:bg-gray-200 transition-colors"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleSpecialtiesExpand(advocate.id);
                              }
                            }}
                            aria-label={
                              expandedAdvocateId === advocate.id
                                ? "Show fewer specialties"
                                : `Show ${
                                    advocate.specialties.length - 2
                                  } more specialties`
                            }
                          >
                            {expandedAdvocateId === advocate.id
                              ? "Show less"
                              : `+${advocate.specialties.length - 2} more`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                      {advocate.yearsOfExperience} years
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden lg:table-cell">
                      <a
                        href={`tel:${advocate.phoneNumber}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        aria-label={`Call ${advocate.firstName} ${
                          advocate.lastName
                        } at ${formatPhoneNumber(advocate.phoneNumber)}`}
                      >
                        {formatPhoneNumber(advocate.phoneNumber)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
              <p className="text-sm text-gray-600">
                {pagination ? (
                  <>
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} advocates
                    {searchTerm && ` matching "${searchTerm}"`}
                  </>
                ) : (
                  `Showing ${advocates.length} advocates`
                )}
              </p>

              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <span className="text-sm text-gray-600">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
