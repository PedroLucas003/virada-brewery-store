import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { beerService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Loader2, Beer } from 'lucide-react';

interface Beer {
  _id: string;
  nome: string;
  descricao: string;
  preco: number;
  teorAlcoolico: number;
  ibu?: number;
  estilo?: string;
  image?: string;
  disponivel: boolean;
}

const AdminDashboard: React.FC = () => {
  const [beers, setBeers] = useState<Beer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingBeer, setEditingBeer] = useState<Beer | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    teorAlcoolico: '',
    ibu: '',
    estilo: '',
    image: '',
    disponivel: true,
  });

  useEffect(() => {
    fetchBeers();
  }, []);

  const fetchBeers = async () => {
    try {
      const response = await beerService.getAllBeers();
      setBeers(response);
    } catch (error) {
      console.error('Error fetching beers:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar cervejas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: '',
      teorAlcoolico: '',
      ibu: '',
      estilo: '',
      image: '',
      disponivel: true,
    });
    setEditingBeer(null);
  };

  const handleEdit = (beer: Beer) => {
    setFormData({
      nome: beer.nome,
      descricao: beer.descricao,
      preco: beer.preco.toString(),
      teorAlcoolico: beer.teorAlcoolico.toString(),
      ibu: beer.ibu?.toString() || '',
      estilo: beer.estilo || '',
      image: beer.image || '',
      disponivel: beer.disponivel,
    });
    setEditingBeer(beer);
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.descricao || !formData.preco || !formData.teorAlcoolico) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const beerData = {
        nome: formData.nome,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        teorAlcoolico: parseFloat(formData.teorAlcoolico),
        ibu: formData.ibu ? parseInt(formData.ibu) : undefined,
        estilo: formData.estilo || undefined,
        image: formData.image || undefined,
        disponivel: formData.disponivel,
      };

      if (editingBeer) {
        await beerService.updateBeer(editingBeer._id, beerData);
        toast({
          title: "Sucesso",
          description: "Cerveja atualizada com sucesso",
        });
      } else {
        await beerService.createBeer(beerData);
        toast({
          title: "Sucesso",
          description: "Cerveja criada com sucesso",
        });
      }

      fetchBeers();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar cerveja",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Tem certeza que deseja excluir a cerveja "${nome}"?`)) {
      return;
    }

    try {
      await beerService.deleteBeer(id);
      toast({
        title: "Sucesso",
        description: "Cerveja excluída com sucesso",
      });
      fetchBeers();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir cerveja",
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
              Gerenciar Cervejas
            </h1>
            <p className="text-muted-foreground">
              Adicione, edite ou remova cervejas do catálogo
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="premium" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Cerveja
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBeer ? 'Editar Cerveja' : 'Nova Cerveja'}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      placeholder="Nome da cerveja"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estilo">Estilo</Label>
                    <Input
                      id="estilo"
                      value={formData.estilo}
                      onChange={(e) => setFormData({ ...formData, estilo: e.target.value })}
                      placeholder="Ex: IPA, Lager, etc."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Descrição da cerveja"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço (R$) *</Label>
                    <Input
                      id="preco"
                      type="number"
                      step="0.01"
                      value={formData.preco}
                      onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teorAlcoolico">Teor Alcoólico (%) *</Label>
                    <Input
                      id="teorAlcoolico"
                      type="number"
                      step="0.1"
                      value={formData.teorAlcoolico}
                      onChange={(e) => setFormData({ ...formData, teorAlcoolico: e.target.value })}
                      placeholder="0.0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ibu">IBU</Label>
                    <Input
                      id="ibu"
                      type="number"
                      value={formData.ibu}
                      onChange={(e) => setFormData({ ...formData, ibu: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="disponivel"
                    checked={formData.disponivel}
                    onCheckedChange={(checked) => setFormData({ ...formData, disponivel: checked })}
                  />
                  <Label htmlFor="disponivel">Disponível para venda</Label>
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
                    {editingBeer ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Carregando cervejas...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beers.map((beer) => (
              <Card key={beer._id} className="group hover:shadow-card transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-display font-semibold text-lg text-foreground">
                          {beer.nome}
                        </h3>
                        {!beer.disponivel && (
                          <Badge variant="destructive" className="text-xs">
                            Indisponível
                          </Badge>
                        )}
                      </div>
                      {beer.estilo && (
                        <Badge variant="secondary" className="text-xs mb-2">
                          {beer.estilo}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(beer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(beer._id, beer.nome)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {beer.descricao}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Preço:</span>
                      <span className="font-medium text-primary">
                        R$ {beer.preco.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Teor Alcoólico:</span>
                      <span>{beer.teorAlcoolico}%</span>
                    </div>
                    {beer.ibu && (
                      <div className="flex justify-between">
                        <span>IBU:</span>
                        <span>{beer.ibu}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;