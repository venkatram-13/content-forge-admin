
import { Navigate } from 'react-router-dom';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const Admin = () => {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-700">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
};

export default Admin;
