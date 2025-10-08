import { useState, useEffect } from 'react';
import { Search, Download, Calendar, Filter, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { transactionsAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 15;

  // Fonction pour charger l'historique des transactions
  const loadTransactionHistory = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getHistory();
      setTransactions(response.data);
      console.log('📜 Historique rechargé:', response.data.length, 'transactions');
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast.error('Impossible de charger l\'historique des transactions');
    } finally {
      setLoading(false);
    }
  };

  // Charger l'historique au montage - le key de App.jsx force le remontage
  useEffect(() => {
    loadTransactionHistory();
  }, []);
  // Filtrage et recherche en temps réel
  useEffect(() => {
    let filtered = transactions;

    // Filtrer par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.statut === statusFilter);
    }

    // Filtrer par date
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(transaction => 
            new Date(transaction.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(transaction => 
            new Date(transaction.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(transaction => 
            new Date(transaction.createdAt) >= filterDate
          );
          break;
      }
    }

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.numeroTransaction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agentNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agentCompte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.distributeurNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.distributeurCompte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agentTelephone.includes(searchQuery) ||
        transaction.distributeurTelephone.includes(searchQuery)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchQuery, statusFilter, dateFilter]);

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'complété':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'annulé':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'bloqué':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    const headers = [
      'Numéro Transaction',
      'Date',
      'Heure',
      'Agent',
      'Compte Agent',
      'Distributeur',
      'Compte Distributeur',
      'Montant',
      'Devise',
      'Type',
      'Statut'
    ];

    const csvData = filteredTransactions.map(transaction => [
      transaction.numeroTransaction,
      new Date(transaction.createdAt).toLocaleDateString('fr-FR'),
      formatTime(transaction.createdAt),
      transaction.agentNom,
      transaction.agentCompte,
      transaction.distributeurNom,
      transaction.distributeurCompte,
      transaction.montant,
      transaction.devise,
      transaction.type,
      transaction.statut
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCurrentPageTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  // Calculer les statistiques
  const stats = {
    total: filteredTransactions.length,
    completed: filteredTransactions.filter(t => t.statut === 'complété').length,
    cancelled: filteredTransactions.filter(t => t.statut === 'annulé').length,
    blocked: filteredTransactions.filter(t => t.statut === 'bloqué').length,
    totalAmount: filteredTransactions
      .filter(t => t.statut === 'complété')
      .reduce((sum, t) => sum + t.montant, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement de l'historique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Historique</h1>
          <p className="text-muted-foreground">
            Historique complet des transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadTransactionHistory} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Rafraîchir
          </Button>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Complétées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">Annulées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalAmount.toLocaleString()} F</div>
            <p className="text-xs text-muted-foreground">Montant total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par numéro, agent, distributeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="complété">Complété</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="annulé">Annulé</SelectItem>
                <SelectItem value="bloqué">Bloqué</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Historique des transactions */}
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getCurrentPageTransactions().map((transaction) => (
              <div
                key={transaction.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-medium">
                        {transaction.numeroTransaction}
                      </span>
                      <Badge className={getStatusColor(transaction.statut)}>
                        {transaction.statut}
                      </Badge>
                      <span className="text-lg font-semibold">
                        {transaction.montant.toLocaleString()} {transaction.devise}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Agent:</span>
                        <div className="text-muted-foreground">
                          {transaction.agentNom}
                          <br />
                          {transaction.agentCompte} • {transaction.agentTelephone}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Distributeur:</span>
                        <div className="text-muted-foreground">
                          {transaction.distributeurNom}
                          <br />
                          {transaction.distributeurCompte} • {transaction.distributeurTelephone}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Détails:</span>
                        <div className="text-muted-foreground">
                          Type: {transaction.type}
                          <br />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {getCurrentPageTransactions().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery || statusFilter !== 'all' || dateFilter !== 'all' ? 
                  'Aucune transaction trouvée avec les filtres appliqués' : 
                  'Aucune transaction dans l\'historique'
                }
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages} • {filteredTransactions.length} transactions
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
