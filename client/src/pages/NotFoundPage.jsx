import { Link } from 'react-router-dom';
import { ROUTES } from '../routes/paths';

export default function NotFoundPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-bold mb-4 tracking-tight">404</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8">The page you are looking for was not found.</p>
      <Link to={ROUTES.HOME} className="btn-primary">Return Home</Link>
    </div>
  );
}
