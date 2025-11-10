import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="m-4">
        <div className="text-blue-600 text-3xl font-bold">DropSpot</div>
      </header>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
