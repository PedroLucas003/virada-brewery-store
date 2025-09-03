import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-secondary border-t border-border mt-20">
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground">V</span>
              </div>
              <span className="font-display font-bold text-lg">Cervejaria Virada</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Produzindo cervejas artesanais premium com ingredientes selecionados e paixão pela tradição cervejeira.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Links Rápidos</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Início
              </Link>
              <Link to="/catalog" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Catálogo
              </Link>
              <a href="#sobre" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Sobre Nós
              </a>
              <a href="#contato" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Contato
              </a>
            </div>
          </div>

          {/* Atendimento */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Atendimento</h3>
            <div className="space-y-2">
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Central de Ajuda
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Termos de Uso
              </a>
              <a href="#" className="block text-muted-foreground hover:text-primary transition-colors text-sm">
                Trocas e Devoluções
              </a>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">contato@cervejariavirada.com.br</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">São Paulo, SP</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Cervejaria Virada. Todos os direitos reservados.
          </p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">
            Beba com responsabilidade. Venda proibida para menores de 18 anos.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;