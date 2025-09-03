import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Settings, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalItems = getTotalItems();

  const NavLinks = ({ mobile = false }) => (
    <div className={`flex ${mobile ? 'flex-col space-y-4' : 'items-center space-x-8'}`}>
      <Link 
        to="/" 
        className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        onClick={() => mobile && setIsOpen(false)}
      >
        Início
      </Link>
      <Link 
        to="/catalog" 
        className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
        onClick={() => mobile && setIsOpen(false)}
      >
        Catálogo
      </Link>
      {isAuthenticated && (
        <Link 
          to="/my-orders" 
          className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
          onClick={() => mobile && setIsOpen(false)}
        >
          Meus Pedidos
        </Link>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="font-display font-bold text-lg text-primary-foreground">V</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">
                Cervejaria Virada
              </h1>
              <p className="text-xs text-muted-foreground hidden lg:block">
                Cervejas Artesanais Premium
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/checkout')}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    Olá, {user?.nome}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-orders')}>
                    <Package className="mr-2 h-4 w-4" />
                    Meus Pedidos
                  </DropdownMenuItem>
                  {user?.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                variant="premium" 
                size="sm"
                onClick={() => navigate('/login')}
              >
                Entrar
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <NavLinks mobile />
                  
                  {isAuthenticated && (
                    <div className="pt-4 border-t border-border">
                      <div className="text-sm font-medium mb-4">
                        Olá, {user?.nome}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="ghost" 
                          className="justify-start"
                          onClick={() => {
                            navigate('/profile');
                            setIsOpen(false);
                          }}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Meu Perfil
                        </Button>
                        {user?.isAdmin && (
                          <Button 
                            variant="ghost" 
                            className="justify-start"
                            onClick={() => {
                              navigate('/admin/dashboard');
                              setIsOpen(false);
                            }}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Painel Admin
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          className="justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;