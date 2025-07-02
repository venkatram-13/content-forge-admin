
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lock, User, AlertCircle, Shield, UserPlus } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const { login, register } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent, action: 'login' | 'register') => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = action === 'login' 
      ? await login(email, password)
      : await register(email, password);

    if (result.error) {
      setError(result.error);
    } else if (action === 'register') {
      setActiveTab('login');
      setError('');
      setEmail('');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Admin Portal
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Secure access to your blog management system</p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 dark:bg-slate-700">
              <TabsTrigger value="login" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100">
                <Lock className="w-4 h-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-600 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100">
                <UserPlus className="w-4 h-4" />
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email Address</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 dark:from-blue-400 dark:to-purple-500 dark:hover:from-blue-500 dark:hover:to-purple-600 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-gray-700 dark:text-gray-200">Email Address</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <Input
                      id="reg-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password" className="text-gray-700 dark:text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                    <Input
                      id="reg-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 dark:from-green-400 dark:to-teal-500 dark:hover:from-green-500 dark:hover:to-teal-600 text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
