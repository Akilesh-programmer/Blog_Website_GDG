export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;
  return (
    <nav
      className="flex items-center justify-between gap-4 mt-8"
      aria-label="Pagination"
    >
      <button
        disabled={prevDisabled}
        onClick={() => onChange(page - 1)}
        className={`btn-outline ${
          prevDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Prev
      </button>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Page {page} of {totalPages}
      </p>
      <button
        disabled={nextDisabled}
        onClick={() => onChange(page + 1)}
        className={`btn-outline ${
          nextDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Next
      </button>
    </nav>
  );
}
