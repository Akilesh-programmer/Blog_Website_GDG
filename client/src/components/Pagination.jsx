export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = totalPages > 1 ? getPageNumbers() : [];

  return (
    <nav className="flex items-center justify-center" aria-label="Pagination">
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          disabled={prevDisabled}
          onClick={() => onChange(page - 1)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
            prevDisabled
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to previous page"
        >
          <svg
            className="w-4 h-4"
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
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center gap-1 mx-2">
          {pageNumbers.map((pageNum, index) => {
            if (pageNum === "...") {
              return (
                <span
                  key={`dots-${index}`}
                  className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  ...
                </span>
              );
            }

            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => onChange(pageNum)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={isActive ? "page" : undefined}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Mobile Page Indicator */}
        <div className="sm:hidden mx-4 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {page} / {totalPages}
          </span>
        </div>

        {/* Next Button */}
        <button
          disabled={nextDisabled}
          onClick={() => onChange(page + 1)}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${
            nextDisabled
              ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
          aria-label="Go to next page"
        >
          Next
          <svg
            className="w-4 h-4"
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
    </nav>
  );
}
