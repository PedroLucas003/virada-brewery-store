import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { userService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Users, Plus, Edit, Trash2, Loader2, Crown, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface User {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  isAdmin: boolean;
  endereco?: {
    cep: string;
    address: string;
    city: string;
    state: string;
  };
  createdAt: string;
  updatedAt: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    isAdmin: false,
    endereco: {
      cep: '',
      address: '',
      city: '',
      state: '',
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar usuários",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      isAdmin: false,
      endereco: {
        cep: '',
        address: '',
        city: '',
        state: '',
      },
    });
    setEditingUser(null);
  };

  const handleEdit = (user: User) => {
    setFormData({
      nome: user.nome,
      email: user.email,
      telefone: user.telefone || '',
      isAdmin: user.isAdmin,
      endereco: {
        cep: user.endereco?.cep || '',
        address: user.endereco?.address || '',
        city: user.endereco?.city || '',
        state: user.endereco?.state || '',
      },
    });
    setEditingUser(user);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.email) {
      toast({
        title: "Erro",
        description: "Nome e email são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const userData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        isAdmin: formData.isAdmin,
        endereco: formData.endereco,
      };

      if (editingUser) {
        await userService.updateUser(editingUser._id, userData);
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        });
      } else {
        await userService.createUser(userData);
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        });
      }

      fetchUsers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar usuário",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário "${nome}"?`)) {
      return;
    }

    try {
      await userService.deleteUser(id);
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      });
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir usuário",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 lg:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Gerenciar Usuários
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os usuários registrados
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemplo.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isAdmin"
                    checked={formData.isAdmin}
                    onCheckedChange={(checked) => setFormData({ ...formData, isAdmin: checked })}
                  />
                  <Label htmlFor="isAdmin">Usuário Administrador</Label>
                </div>

                <div className="space-y-4">
                  <Label className="text-base font-medium">Endereço</Label>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input
                        id="cep"
                        value={formData.endereco.cep}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, cep: e.target.value }
                        })}
                        placeholder="00000-000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.endereco.city}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          endereco: { ...formData.endereco, city: e.target.value }
                        })}
                        placeholder="São Paulo"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      value={formData.endereco.address}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, address: e.target.value }
                      })}
                      placeholder="Rua, número, complemento"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={formData.endereco.state}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        endereco: { ...formData.endereco, state: e.target.value }
                      })}
                      placeholder="SP"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="premium"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingUser ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando usuários...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user._id} className="group hover:shadow-card transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        {user.isAdmin ? (
                          <Crown className="h-6 w-6 text-primary-foreground" />
                        ) : (
                          <User className="h-6 w-6 text-primary-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-display">
                          {user.nome}
                        </CardTitle>
                        {user.isAdmin && (
                          <Badge className="bg-primary/20 text-primary border border-primary/30">
                            Administrador
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user._id, user.nome)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Email:</p>
                      <p className="text-sm font-medium">{user.email}</p>
                    </div>

                    {user.telefone && (
                      <div>
                        <p className="text-sm text-muted-foreground">Telefone:</p>
                        <p className="text-sm font-medium">{user.telefone}</p>
                      </div>
                    )}

                    {user.endereco && (
                      <div>
                        <p className="text-sm text-muted-foreground">Cidade:</p>
                        <p className="text-sm font-medium">
                          {user.endereco.city}, {user.endereco.state}
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Cadastrado em:</p>
                      <p className="text-sm font-medium">
                        {format(new Date(user.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {users.length === 0 && !loading && (
          <div className="text-center py-20">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              Nenhum usuário encontrado
            </h3>
            <p className="text-muted-foreground">
              Crie o primeiro usuário do sistema
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;