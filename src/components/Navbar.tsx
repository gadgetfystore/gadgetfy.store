import { Link } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user, isAdmin, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-[hsl(var(--navbar-premium-border))] bg-[hsl(var(--navbar-premium))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--navbar-premium))]/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>EchoDeals Store</span>
          </Link>

          <div className="flex items-center gap-4">
            {user && (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
