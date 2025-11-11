import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

interface HeaderProps {
  breadcrumbs: string[];
}

export default function Header({ breadcrumbs }: HeaderProps) {
  return (
    <header className="h-16 bg-white shadow-sm px-6 flex items-center">
      <div className="flex items-center text-gray-600">
        <Link to="/dashboard" className="flex items-center hover:text-gray-900 transition-colors">
          <HomeOutlined className="mr-2" />
          <span>Home</span>
        </Link>

        {breadcrumbs.slice(1).map((crumb, idx) => (
          <span key={idx}>
            <span className="mx-2">/</span>
            <Link
              to={`/dashboard/${crumb.toLowerCase()}`}
              className="text-gray-900 font-medium hover:underline"
            >
              {crumb}
            </Link>
          </span>
        ))}
      </div>
    </header>
  );
}
