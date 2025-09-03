import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Percent } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface Beer {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  teorAlcoolico: number;
  ibu?: number;
  estilo?: string;
  image?: string;
  disponivel?: boolean;
}

interface BeerCardProps {
  beer: Beer;
  className?: string;
}

const BeerCard: React.FC<BeerCardProps> = ({ beer, className }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      _id: beer._id,
      nome: beer.nome,
      preco: beer.preco,
      image: beer.image,
      teorAlcoolico: beer.teorAlcoolico,
    });
  };

  return (
    <Card className={`group hover:shadow-card transition-all duration-300 bg-card border-border overflow-hidden ${className}`}>
      <div className="relative overflow-hidden">
        {beer.image ? (
          <img
            src={beer.image}
            alt={beer.nome}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-secondary flex items-center justify-center">
            <span className="text-4xl font-display text-primary">🍺</span>
          </div>
        )}
        
        {/* Overlay with alcohol percentage */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
            <Percent className="w-3 h-3 mr-1" />
            {beer.teorAlcoolico}%
          </Badge>
        </div>
        
        {/* Availability indicator */}
        {beer.disponivel === false && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Indisponível
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {beer.nome}
          </h3>
          {beer.estilo && (
            <Badge variant="secondary" className="text-xs mt-1">
              {beer.estilo}
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
          {beer.descricao}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Teor Alcoólico: {beer.teorAlcoolico}%</span>
          {beer.ibu && <span>IBU: {beer.ibu}</span>}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-2xl font-bold text-primary">
            R$ {beer.preco.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-xs text-muted-foreground">por unidade</span>
        </div>

        <Button
          variant="cart"
          size="sm"
          onClick={handleAddToCart}
          disabled={beer.disponivel === false}
          className="min-w-[100px]"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BeerCard;