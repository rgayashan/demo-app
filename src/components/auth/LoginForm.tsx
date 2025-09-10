import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';

/**
 * Login form component with demo credentials
 */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const demoCredentials = [
    { role: 'Broker', email: 'broker@demo.com', description: 'Can view and edit borrowers, request documents' },
    { role: 'Admin', email: 'admin@demo.com', description: 'Full access including loan approvals and user management' },
    { role: 'Viewer', email: 'viewer@demo.com', description: 'Read-only access to borrowers and broker stats' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Use the demo credentials below to test different user roles
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demo Credentials</CardTitle>
            <CardDescription>
              Click on any credential to auto-fill the form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoCredentials.map((cred) => (
                <div
                  key={cred.email}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword('demo123');
                  }}
                >
                  <div className="font-medium text-sm">{cred.role}</div>
                  <div className="text-xs text-gray-600">{cred.email}</div>
                  <div className="text-xs text-gray-500 mt-1">{cred.description}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              <strong>Password for all accounts:</strong> demo123
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
