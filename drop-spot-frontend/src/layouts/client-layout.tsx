import { Outlet } from 'react-router-dom';

export default function ClientLayout() {
  const userName = 'User';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold">
              <span className="text-[#155DFC]">DropSpot</span>
            </div>
          </div>
          <div className="text-lg font-semibold text-gray-700">
            Welcome to <span className="text-[#155DFC]">{userName}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Copyright © Firass Hossreh • 11/11/2025</p>
        </div>
      </footer>
    </div>
  );
}
