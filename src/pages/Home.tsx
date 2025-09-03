import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BeerCard from '@/components/BeerCard';
import { useNavigate } from 'react-router-dom';
import { beerService } from '@/services/api';
import { Loader2, Award, Users, Clock, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-brewery.jpg';

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

const Home: React.FC = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const response = await beerService.getPublicBeers();
        setBeers(response.slice(0, 6)); // Show only first 6 beers
      } catch (error) {
        console.error('Error fetching beers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] lg:h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${heroImage})`
        }}
      >
        <div className="container mx-auto px-4 lg:px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <Badge className="bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
              ✨ Cervejas Artesanais Premium
            </Badge>
            
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Sabores <span className="text-primary">Únicos</span><br />
              Tradição <span className="text-primary">Autêntica</span>
            </h1>
            
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Descubra nossa seleção exclusiva de cervejas artesanais, 
              produzidas com ingredientes premium e muito amor pela tradição cervejeira.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                variant="premium"
                size="xl"
                onClick={() => navigate('/catalog')}
                className="group"
              >
                Explorar Catálogo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                variant="hero"
                size="xl"
                onClick={() => navigate('/about')}
              >
                Nossa História
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-1 h-8 bg-primary/50 rounded-full"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-background-secondary">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Por que escolher a <span className="text-primary">Cervejaria Virada?</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Mais de uma década de experiência criando cervejas excepcionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-border bg-card hover:shadow-card transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  Qualidade Premium
                </h3>
                <p className="text-muted-foreground">
                  Ingredientes selecionados e processos artesanais que garantem sabor único em cada gole.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card hover:shadow-card transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  Tradição Familiar
                </h3>
                <p className="text-muted-foreground">
                  Receitas passadas de geração em geração, combinadas com técnicas modernas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-border bg-card hover:shadow-card transition-all duration-300 group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-xl text-foreground mb-3">
                  Entrega Rápida
                </h3>
                <p className="text-muted-foreground">
                  Receba suas cervejas favoritas no conforto da sua casa com entrega expressa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Beers Section */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Nossas <span className="text-primary">Cervejas em Destaque</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça algumas das nossas criações mais populares
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando cervejas...</span>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {beers.map((beer) => (
                  <BeerCard key={beer._id} beer={beer} />
                ))}
              </div>

              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/catalog')}
                  className="group"
                >
                  Ver Todas as Cervejas
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-secondary">
        <div className="container mx-auto px-4 lg:px-6">
          <Card className="max-w-4xl mx-auto bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardContent className="p-8 lg:p-12 text-center">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Fique por dentro das <span className="text-primary">novidades</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Seja o primeiro a saber sobre lançamentos exclusivos, promoções especiais e eventos da cervejaria.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="premium">
                  Cadastrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;