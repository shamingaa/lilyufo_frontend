import { NavLink, Outlet } from 'react-router-dom';
import { pageHeading } from '../../styles';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-sm px-3 py-2 text-sm transition ${
    isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
  }`;

export function AdminLayout() {
  return (
    <div>
      <h1 className={`mb-6 ${pageHeading}`}>Admin Dashboard</h1>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex shrink-0 gap-2 md:w-48 md:flex-col">
          <NavLink to="/admin" end className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
        </nav>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
