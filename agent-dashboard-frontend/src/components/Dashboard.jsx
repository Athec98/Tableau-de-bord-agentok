import { useState, useEffect } from 'react';
import { Search, Users, UserCheck, Building, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { usersAPI } from '@/services/api';
import { toast } from 'sonner';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [stats, setStats] = useState({
    clients: 0,
    agents: 0,
    distributeurs: 0
  });

  // Fonction pour charger les statistiques
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const response = await usersAPI.getAll();
      const users = response.data || [];
      
      setStats({
        clients: users.filter(u => u.role === 'client').length,
        agents: users.filter(u => u.role === 'agent').length,
        distributeurs: users.filter(u => u.role === 'distributeur').length
      });
      console.log('📊 Statistiques rechargées:', {
        clients: users.filter(u => u.role === 'client').length,
        agents: users.filter(u => u.role === 'agent').length,
        distributeurs: users.filter(u => u.role === 'distributeur').length
      });
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
      // N'afficher le toast que si c'est une véritable erreur (pas un timeout)
      if (error.code !== 'ECONNABORTED') {
        toast.error('Impossible de charger les statistiques', {
          description: 'Vérifiez votre connexion au serveur'
        });
      }
      // Garder les stats à 0 en cas d'erreur pour que l'interface reste fonctionnelle
    } finally {
      setLoadingStats(false);
    }
  };

  // Charger les statistiques au montage - le key de App.jsx force le remontage
  useEffect(() => {
    // Petit délai pour éviter les problèmes de timing au premier rendu
    const timer = setTimeout(() => {
      loadStats();
    }, 100);
    
    return () => {
      clearTimeout(timer);
      // Fermer le dialog au démontage pour éviter les erreurs de portal
      setIsDetailsOpen(false);
    };
  }, []);

  // Recherche en temps réel via API
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        const response = await usersAPI.search(searchQuery);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        // Ne pas afficher de toast pour éviter de spammer l'utilisateur pendant la saisie
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const getRoleColor = (role) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'agent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'distributeur':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const StatCard = ({ title, value, icon: Icon, description, color }) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Vue d'ensemble de votre tableau de bord agent
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadStats}
          disabled={loadingStats}
        >
          <RefreshCw className={`h-4 w-4 ${loadingStats ? 'animate-spin' : ''} md:mr-2`} />
          <span className="hidden md:inline">Rafraîchir</span>
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Nombre de Clients"
          value={stats.clients}
          icon={Users}
          description="Clients actifs"
          color="text-blue-600"
        />
        <StatCard
          title="Nombre d'Agents"
          value={stats.agents}
          icon={UserCheck}
          description="Agents en service"
          color="text-green-600"
        />
        <StatCard
          title="Nombre de Distributeurs"
          value={stats.distributeurs}
          icon={Building}
          description="Distributeurs partenaires"
          color="text-purple-600"
        />
      </div>

      {/* Recherche d'utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche d'Utilisateurs</CardTitle>
          <CardDescription>
            Recherchez un utilisateur par numéro de compte, email ou numéro de téléphone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par compte, email ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Résultats de recherche */}
          {searchQuery.length >= 2 && (
            <div className="space-y-2">
              {isSearching ? (
                <div className="text-center py-4 text-muted-foreground">
                  Recherche en cours...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Résultats ({searchResults.length})</h4>
                  {searchResults.map((user) => (
                    <div
                      key={user._id || user.id}
                      className="flex flex-col md:flex-row md:items-center md:justify-between p-3 border rounded-lg hover:bg-accent transition-colors gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="font-medium truncate">
                            {user.prenom} {user.nom}
                          </span>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <div className="truncate">{user.email}</div>
                          <div className="flex flex-wrap gap-1 text-xs mt-1">
                            <span className="font-mono">{user.numeroCompte}</span>
                            <span>•</span>
                            <span>{user.telephone}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailsOpen(true);
                        }}
                        className="w-full md:w-auto"
                      >
                        Voir détails
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Aucun utilisateur trouvé pour "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog des détails utilisateur */}
      {selectedUser && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l'utilisateur</DialogTitle>
              <DialogDescription>
                Informations complètes de l'utilisateur
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Photo et infos principales */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.photo} alt={`${selectedUser.prenom} ${selectedUser.nom}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {selectedUser.nom?.charAt(0)}{selectedUser.prenom?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.prenom} {selectedUser.nom}</h3>
                  <Badge className="mt-1">
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>

              {/* Informations détaillées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Numéro de compte</Label>
                  <p className="text-sm font-mono">{selectedUser.numeroCompte}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Téléphone</Label>
                  <p className="text-sm">{selectedUser.telephone}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Statut</Label>
                  <p className="text-sm">
                    {selectedUser.isActive ? (
                      <Badge className="bg-green-500">Actif</Badge>
                    ) : (
                      <Badge className="bg-red-500">Bloqué</Badge>
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date de création</Label>
                  <p className="text-sm">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Dashboard;
