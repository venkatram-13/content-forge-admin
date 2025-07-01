
import { Navigate } from 'react-router-dom';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminDashboard } from '@/components/AdminDashboard';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const Admin = () => {
  const { user, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50/30 to-pink-50/30 dark:from-slate-900 dark:via-violet-900/10 dark:to-pink-900/10">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-700 border-t-violet-600 dark:border-t-violet-400 rounded-full animate-spin mx-auto mb-6"></div>
          <div className="text-xl font-semibold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Loading...</div>
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
