import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b border-stone-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="font-serif text-2xl tracking-tight text-pink-800">
          Lily UfÓ
        </Link>
        <div className="flex items-center gap-6 text-xs font-medium uppercase tracking-wider text-stone-600">
          <Link to="/" className="transition hover:text-stone-900">
            Shop
          </Link>
          <Link to="/cart" className="relative transition hover:text-stone-900">
            Cart
            {totalItems > 0 && (
              <span className="ml-1 rounded-full bg-brand-700 px-1.5 py-0.5 text-[10px] normal-case text-white">
                {totalItems}
              </span>
            )}
          </Link>
          {user && user.role === 'customer' && (
            <Link to="/my-orders" className="transition hover:text-stone-900">
              My Orders
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="transition hover:text-stone-900">
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              aria-label="Log out"
              title="Log out"
              className="text-red-600 transition hover:text-red-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
                />
              </svg>
            </button>
          ) : (
            <Link to="/login" className="transition hover:text-stone-900">
              Log in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
