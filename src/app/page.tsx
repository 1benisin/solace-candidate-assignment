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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Advocate
            </h1>
            <p className="text-xl md:text-2xl text-emerald-100 mb-2">
              Connect with experienced healthcare advocates who understand your
              needs
            </p>
            <p className="text-emerald-200">
              Whether you need help navigating insurance, finding specialists,
              or coordinating care
            </p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 -mt-8 max-w-7xl relative z-10">
        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Search Our Network of Advocates
            </h2>
            <p className="text-gray-600">
              Find the perfect advocate by name, location, specialty, or
              experience level
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
                onChange={handleSearchChange}
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
              onClick={handleResetSearch}
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
                  Searching for:{" "}
                  <span className="font-semibold">{searchTerm}</span>
                  {isSearching && <span className="ml-2">(searching...)</span>}
                </span>
              </div>
            </div>
          )}
        </div>

        {advocates.length === 0 ? (
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
              {searchTerm ? "No advocates found" : "No advocates available"}
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm
                ? "Try adjusting your search terms or clear the search to see all advocates."
                : "There are currently no advocates in the system."}
            </p>
          </div>
        ) : (
          <>
            {/* Advocates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {advocates.map((advocate) => (
                <div
                  key={advocate.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 overflow-hidden"
                >
                  {/* Card Header with Avatar */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold text-xl">
                          {advocate.firstName[0]}
                          {advocate.lastName[0]}
                        </div>
                        <div className="mt-2 flex items-center justify-center">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-3 w-3 ${
                                  i < 4 ? "text-yellow-400" : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {advocate.firstName} {advocate.lastName}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm">{advocate.city}</span>
                        </div>
                        <div className="flex items-center text-emerald-600 mb-1">
                          <svg
                            className="h-4 w-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            Verified Advocate
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {advocate.degree} • {advocate.yearsOfExperience} years
                          experience
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="px-6 pb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(expandedAdvocateId === advocate.id
                        ? advocate.specialties
                        : advocate.specialties.slice(0, 3)
                      ).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          {specialty}
                        </span>
                      ))}
                      {advocate.specialties.length > 3 && (
                        <button
                          onClick={() => handleSpecialtiesExpand(advocate.id)}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
                          aria-label={
                            expandedAdvocateId === advocate.id
                              ? "Show fewer specialties"
                              : `Show ${
                                  advocate.specialties.length - 3
                                } more specialties`
                          }
                        >
                          {expandedAdvocateId === advocate.id
                            ? "Show less"
                            : `+${advocate.specialties.length - 3} more`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Footer - Contact */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-xs">Available Now</span>
                      </div>
                      <a
                        href={`tel:${advocate.phoneNumber}`}
                        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
                        aria-label={`Call ${advocate.firstName} ${
                          advocate.lastName
                        } at ${formatPhoneNumber(advocate.phoneNumber)}`}
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Call Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                  <p className="text-gray-600">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} advocates
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
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
                      onClick={() => handlePageChange(currentPage + 1)}
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
            )}

            {/* Results Summary */}
            {!pagination && (
              <div className="text-center py-4">
                <p className="text-gray-600">
                  Showing {advocates.length} advocates
                  {searchTerm && ` matching "${searchTerm}"`}
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
