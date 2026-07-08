import { Link } from 'react-router-dom';
import { pageHeading, subtleLink } from '../styles';

export function NotFound() {
  return (
    <div className="text-center">
      <h1 className={pageHeading}>Page not found</h1>
      <Link to="/" className={`mt-4 inline-block ${subtleLink}`}>
        Back to shop
      </Link>
    </div>
  );
}
