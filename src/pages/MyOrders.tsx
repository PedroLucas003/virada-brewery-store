import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { orderService } from '@/services/api';
import { Loader2, Package, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Order {
  _id: string;
  items: Array<{
    _id: string;
    nome: string;
    preco: number;
    quantity: number;
  }>;
  status: string;
  total: number;
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    cep: string;
  };
  createdAt: string;
  updatedAt: string;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-warning text-warning-foreground';
    case 'processing':
      return 'bg-primary text-primary-foreground';
    case 'shipped':
      return 'bg-primary text-primary-foreground';
    case 'delivered':
      return 'bg-success text-success-foreground';
    case 'cancelled':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-secondary text-secondary-foreground';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Pendente';
    case 'processing':
      return 'Processando';
    case 'shipped':
      return 'Enviado';
    case 'delivered':
      return 'Entregue';
    case 'cancelled':
      return 'Cancelado';
    default:
      return status;
  }
};

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getMyOrders();
        setOrders(response);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando pedidos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Meus Pedidos
            </h1>
            <p className="text-muted-foreground">
              Acompanhe o status dos seus pedidos
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Nenhum pedido encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Você ainda não fez nenhum pedido. Que tal explorar nosso catálogo?
              </p>
              <Button variant="premium" onClick={() => window.location.href = '/catalog'}>
                Ver Catálogo
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="font-display text-lg">
                        Pedido #{order._id.slice(-8)}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Pedido em {format(new Date(order.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 sm:mt-0">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {order.shippingAddress.city}, {order.shippingAddress.state}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {/* Items */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Itens do pedido:</h4>
                        {order.items.map((item) => (
                          <div key={item._id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-secondary rounded-lg flex items-center justify-center">
                                🍺
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{item.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                  Quantidade: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-primary">
                                R$ {item.preco.toFixed(2).replace('.', ',')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                cada
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Shipping Address */}
                      <div className="p-3 bg-background-secondary rounded-lg">
                        <h4 className="font-medium text-foreground mb-2">Endereço de entrega:</h4>
                        <p className="text-sm text-muted-foreground">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.cep}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="text-lg font-semibold text-foreground">Total:</span>
                        <span className="text-xl font-bold text-primary">
                          R$ {order.total.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;