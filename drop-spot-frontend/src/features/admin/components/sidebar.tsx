import { useState } from 'react';
import {
  MenuOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentPath: string;
  onMenuClick: (path: string) => void;
  onAccountClick: () => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  currentPath,
  onMenuClick,
  onAccountClick,
}: SidebarProps) {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);

  return (
    <div
      className="flex flex-col transition-all duration-300"
      style={{ width: collapsed ? '80px' : '256px', backgroundColor: '#4096FF' }}
    >
      {/* Logo ve Toggle */}
      <div className="h-16 flex items-center justify-between px-4 text-white font-bold text-2xl border-b border-white/10">
        <div
          className="hover:opacity-80 transition-opacity cursor-pointer"
          onClick={() => onMenuClick('home')}
        >
          {collapsed ? 'DS' : 'DropSpot'}
        </div>
        <button onClick={onToggle} className="p-1.5 hover:bg-white/10 rounded transition-colors">
          {collapsed ? <RightOutlined /> : <LeftOutlined />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 flex flex-col gap-1">
        <button
          onClick={() => onMenuClick('drops')}
          className={`flex items-center px-6 py-3 text-white rounded hover:bg-white/10 transition-colors ${
            currentPath === 'drops' ? 'bg-white/20 font-semibold' : ''
          }`}
        >
          <MenuOutlined className="mr-3" />
          {!collapsed && <span>Drops</span>}
        </button>
      </nav>

      {/* Account / Logout */}
      <div
        className="border-t border-white/10 p-4 relative"
        onMouseEnter={() => setShowLogoutBtn(true)}
        onMouseLeave={() => setShowLogoutBtn(false)}
      >
        <div className="relative">
          <div className="w-full flex items-center text-white rounded p-2 transition-colors">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <UserOutlined />
            </div>
            {!collapsed && (
              <div className="ml-3 overflow-hidden text-left">
                <div className="font-medium text-sm">Admin User</div>
                <div className="text-xs text-white/70 truncate">admin@dropspot.com</div>
              </div>
            )}
          </div>

          {showLogoutBtn && (
            <button
              onClick={onAccountClick}
              className="absolute bottom-full left-0 right-0 mb-2 bg-red-500 hover:bg-red-600 text-white rounded p-2 shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <LogoutOutlined />
              {!collapsed && <span className="text-sm font-medium">Çıkış Yap</span>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
