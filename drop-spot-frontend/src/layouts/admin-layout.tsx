import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../features/admin/components/sidebar';
import Header from '../features/admin/components/header';
import LogoutModal from '../features/admin/components/logout-modal';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const paths = location.pathname.split('/').filter(Boolean);

  const handleLogout = () => {
    console.log('Çıkış yapılıyor...');
    setShowLogoutModal(false);
    navigate('/login');
  };

  const handleMenuClick = (path: string) => {
    if (path === 'home') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${path}`);
    }
  };

  const getBreadcrumbs = () => {
    const crumbs = ['Anasayfa'];
    if (paths.length > 1) {
      crumbs.push(paths[1].charAt(0).toUpperCase() + paths[1].slice(1));
    }
    return crumbs;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        currentPath={paths[1] || 'home'}
        onMenuClick={handleMenuClick}
        onAccountClick={() => setShowLogoutModal(true)}
      />

      <div className="flex-1 flex flex-col">
        <Header breadcrumbs={getBreadcrumbs()} />

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
