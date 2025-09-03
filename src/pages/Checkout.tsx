import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Loader2, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';

const Checkout: React.FC = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState({
    cep: user?.endereco?.cep || '',
    address: user?.endereco?.address || '',
    city: user?.endereco?.city || '',
    state: user?.endereco?.state || '',
  });

  const totalPrice = getTotalPrice();
  const shippingFee = 15.90; // Fixed shipping fee
  const finalTotal = totalPrice + shippingFee;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast({
        title: "Carrinho vazio",
        description: "Adicione itens ao carrinho antes de finalizar a compra",
        variant: "destructive",
      });
      return;
    }

    if (!shippingAddress.cep || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state) {
      toast({
        title: "Endereço incompleto",
        description: "Preencha todos os campos do endereço de entrega",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await paymentService.createPreference(
        items.map(item => ({
          _id: item._id,
          nome: item.nome,
          price: item.preco,
          quantity: item.quantity,
        })),
        shippingAddress
      );

      // Clear cart and redirect to Mercado Pago
      clearCart();
      
      toast({
        title: "Redirecionando para pagamento",
        description: "Você será redirecionado para finalizar sua compra",
      });
      
      // Redirect to Mercado Pago
      window.location.href = response.init_point;
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Erro no checkout",
        description: error.response?.data?.message || "Erro ao processar pagamento",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              Seu carrinho está vazio
            </h1>
            <p className="text-muted-foreground mb-6">
              Adicione cervejas ao carrinho para continuar com a compra
            </p>
            <Button 
              variant="premium" 
              onClick={() => navigate('/catalog')}
            >
              Ver Catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Finalizar Compra
          </h1>
          <p className="text-muted-foreground">
            Revise seu pedido e confirme o endereço de entrega
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 bg-background-secondary rounded-lg">
                    <div className="w-16 h-16 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      {item.image ? (
                        <img src={item.image} alt={item.nome} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-2xl">🍺</span>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{item.nome}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.teorAlcoolico}% álcool
                      </p>
                      <p className="text-sm font-medium text-primary">
                        R$ {item.preco.toFixed(2).replace('.', ',')}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      
                      <Badge variant="secondary" className="min-w-[40px] text-center">
                        {item.quantity}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle>Endereço de Entrega</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      placeholder="00000-000"
                      value={shippingAddress.cep}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, cep: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      placeholder="São Paulo"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço Completo</Label>
                  <Input
                    id="address"
                    placeholder="Rua, número, complemento"
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    placeholder="SP"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} itens)</span>
                    <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Frete</span>
                    <span>R$ {shippingFee.toFixed(2).replace('.', ',')}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-primary">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <Button
                  variant="premium"
                  size="lg"
                  className="w-full"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Finalizar Compra
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Você será redirecionado para o Mercado Pago para finalizar o pagamento
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;