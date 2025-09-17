"use client";

import { useEffect, useState, useCallback, type ChangeEvent } from "react";
import { Advocate, AdvocatesResponse, PaginationInfo } from "../types/advocate";
import { HeroHeader } from "../components/HeroHeader";
import { SearchCard } from "../components/SearchCard";
import { LoadingState } from "../components/LoadingState";
import { ErrorState } from "../components/ErrorState";
import { AdvocateEmptyState } from "../components/AdvocateEmptyState";
import { AdvocateGrid } from "../components/AdvocateGrid";
import { PaginationControls } from "../components/PaginationControls";
import { SearchResultsSummary } from "../components/SearchResultsSummary";

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
        setPagination(jsonResponse.pagination ?? null);
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

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
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
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroHeader />

      <main className="container mx-auto px-4 -mt-8 max-w-7xl relative z-10">
        <SearchCard
          searchTerm={searchTerm}
          isSearching={isSearching}
          onSearchChange={handleSearchChange}
          onReset={handleResetSearch}
        />

        {advocates.length === 0 ? (
          <AdvocateEmptyState searchTerm={searchTerm} />
        ) : (
          <>
            <AdvocateGrid
              advocates={advocates}
              expandedAdvocateId={expandedAdvocateId}
              onToggleSpecialties={handleSpecialtiesExpand}
            />

            {pagination && pagination.totalPages > 1 && (
              <PaginationControls
                pagination={pagination}
                searchTerm={searchTerm}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}

            {!pagination && (
              <SearchResultsSummary
                count={advocates.length}
                searchTerm={searchTerm}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
