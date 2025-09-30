import { Link } from "react-router-dom";
import { ROUTES } from "../routes/paths";

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gray-100 dark:bg-gray-800 flex-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            404
          </h1>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Page Not Found
          </h2>
          <p className="text-body text-gray-600 dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={ROUTES.HOME} className="btn-primary">
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-outline">
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
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
