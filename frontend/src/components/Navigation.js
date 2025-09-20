import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { 
  Waves, 
  Home, 
  Fish, 
  TrendingUp, 
  Navigation as NavigationIcon, 
  MessageSquare, 
  AlertTriangle,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  Bell,
  X
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

const Navigation = () => {
  const location = useLocation();
  const { currentUser, onLogout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Fish Forecast',
      href: '/dashboard?tab=forecast',
      icon: Fish,
      current: location.search.includes('tab=forecast')
    },
    {
      name: 'Market Prices',
      href: '/dashboard?tab=market',
      icon: TrendingUp,
      current: location.search.includes('tab=market')
    },
    {
      name: 'Journey Track',
      href: '/dashboard?tab=journey',
      icon: NavigationIcon,
      current: location.search.includes('tab=journey')
    },
    {
      name: 'AI Assistant',
      href: '/dashboard?tab=assistant',
      icon: MessageSquare,
      current: location.search.includes('tab=assistant')
    }
  ];

  // Add policymaker-specific items
  if (currentUser?.role === 'policymaker') {
    navigationItems.push(
      {
        name: 'Analytics',
        href: '/dashboard?tab=analytics',
        icon: BarChart3,
        current: location.search.includes('tab=analytics')
      },
      {
        name: 'Compliance',
        href: '/dashboard?tab=compliance',
        icon: AlertTriangle,
        current: location.search.includes('tab=compliance')
      }
    );
  }

  const handleLogout = () => {
    onLogout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    return currentUser.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = () => {
    return currentUser?.role === 'policymaker' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Waves className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-blue-900">BlueNet</span>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${item.current
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          {/* Desktop User Menu */}
          <div className="hidden md:ml-6 md:flex md:items-center">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]" variant="destructive">3</Badge>
              <span className="sr-only">Notifications</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ml-3 relative rounded-full">
                  <Avatar>
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${item.current
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </div>
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{currentUser?.name}</div>
                <div className="text-sm font-medium text-gray-500">{currentUser?.email}</div>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Bell className="h-5 w-5" />
                <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]" variant="destructive">3</Badge>
              </Button>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <Button variant="ghost" className="w-full justify-start text-left">
                <User className="mr-3 h-5 w-5" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left" onClick={handleLogout}>
                <LogOut className="mr-3 h-5 w-5" />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navigation;