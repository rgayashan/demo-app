import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * A layout component for the demo app's dashboard.
 *
 * This component renders a responsive layout with a header and main content area.
 * The header contains a search bar and navigation icons. The main content area
 * is a grid that adapts to the screen size.
 *
 * @example
 * import { DashboardLayout } from 'demo-app';
 *
 * <DashboardLayout>
 *   <div className="lg:col-span-6">Content</div>
 *   <div className="lg:col-span-6">Content</div>
 * </DashboardLayout>
 *
 * @param {React.ReactNode} children - The content to render inside the main content area.
 */
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Mobile: Centered layout with icons */}
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">DemoApp</h1>
            
            {/* Mobile icons - only show on mobile */}
            <div className="flex items-center gap-2 sm:hidden">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search..."
                className="pl-10 w-full sm:w-80 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
            
            {/* Desktop icons - only show on desktop */}
            <div className="hidden sm:flex items-center justify-end gap-2">
              <Button variant="ghost" size="icon" className="text-gray-600">
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};