import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BeerCard from '@/components/BeerCard';
import { beerService } from '@/services/api';
import { Search, Filter, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const Catalog: React.FC = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [filteredBeers, setFilteredBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await beerService.getPublicBeers();
        setBeers(response);
        setFilteredBeers(response);
      } catch (error) {
        console.error('Error fetching beers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  useEffect(() => {
    let filtered = [...beers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(beer =>
        beer.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        beer.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by style
    if (selectedStyle && selectedStyle !== 'all') {
      filtered = filtered.filter(beer => beer.estilo === selectedStyle);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.preco - b.preco;
        case 'price-desc':
          return b.preco - a.preco;
        case 'alcohol-asc':
          return a.teorAlcoolico - b.teorAlcoolico;
        case 'alcohol-desc':
          return b.teorAlcoolico - a.teorAlcoolico;
        case 'name':
        default:
          return a.nome.localeCompare(b.nome);
      }
    });

    setFilteredBeers(filtered);
  }, [beers, searchTerm, selectedStyle, sortBy]);

  const uniqueStyles = [...new Set(beers.map(beer => beer.estilo).filter(Boolean))];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Catálogo de <span className="text-primary">Cervejas</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore nossa coleção completa de cervejas artesanais premium
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cervejas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Style Filter */}
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Estilo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os estilos</SelectItem>
                  {uniqueStyles.map((style) => (
                    <SelectItem key={style} value={style!}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome A-Z</SelectItem>
                  <SelectItem value="price-asc">Preço crescente</SelectItem>
                  <SelectItem value="price-desc">Preço decrescente</SelectItem>
                  <SelectItem value="alcohol-asc">Menor teor alcoólico</SelectItem>
                  <SelectItem value="alcohol-desc">Maior teor alcoólico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mt-4 flex items-center justify-between">
              <Badge variant="secondary">
                {filteredBeers.length} cerveja{filteredBeers.length !== 1 ? 's' : ''} encontrada{filteredBeers.length !== 1 ? 's' : ''}
              </Badge>

              {(searchTerm || selectedStyle) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedStyle('');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Beer Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando cervejas...</span>
          </div>
        ) : filteredBeers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeers.map((beer) => (
              <BeerCard key={beer._id} beer={beer} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍺</div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhuma cerveja encontrada
            </h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar seus filtros ou buscar por outros termos
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedStyle('');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;