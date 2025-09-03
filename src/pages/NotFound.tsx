import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-8xl mb-4 text-primary">🍺</div>
        <h1 className="font-display text-4xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Esta página não foi encontrada
        </p>
        <p className="text-muted-foreground mb-8">
          Parece que você tentou acessar uma cerveja que não existe no nosso catálogo.
        </p>
        <Button 
          variant="premium" 
          onClick={() => window.location.href = '/'}
        >
          Voltar para Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
