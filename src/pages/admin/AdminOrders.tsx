import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Package, Calendar, MapPin, User, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Order {
  _id: string;
  user: {
    _id: string;
    nome: string;
    email: string;
  };
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

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'processing', label: 'Processando' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar pedidos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      ));
      
      toast({
        title: "Status atualizado",
        description: `Status do pedido atualizado para ${getStatusText(newStatus)}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao atualizar status do pedido",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

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
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Gerenciar Pedidos
          </h1>
          <p className="text-muted-foreground">
            Visualize e gerencie todos os pedidos realizados
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhum pedido encontrado
            </h3>
            <p className="text-muted-foreground">
              Ainda não há pedidos realizados no sistema
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <CardTitle className="font-display text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Pedido #{order._id.slice(-8)}
                      </CardTitle>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{order.user.nome}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {order.shippingAddress.city}, {order.shippingAddress.state}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order._id, value)}
                        disabled={updatingStatus === order._id}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {updatingStatus === order._id && (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Informações do Cliente</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nome: </span>
                          <span className="font-medium">{order.user.nome}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email: </span>
                          <span className="font-medium">{order.user.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Itens do Pedido</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item._id} className="flex items-center justify-between p-2 bg-background-secondary rounded-lg">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">🍺</span>
                              <div>
                                <p className="text-sm font-medium">{item.nome}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qtd: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-primary">
                              R$ {item.preco.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping & Total */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Endereço de Entrega</h4>
                      <div className="p-3 bg-background-secondary rounded-lg">
                        <p className="text-sm">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          CEP: {order.shippingAddress.cep}
                        </p>
                      </div>
                      
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-foreground">Total:</span>
                          <span className="text-xl font-bold text-primary">
                            R$ {order.total.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {order.updatedAt !== order.createdAt && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Última atualização: {format(new Date(order.updatedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;