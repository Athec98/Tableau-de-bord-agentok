import { useState, useEffect } from 'react';
import { Search, XCircle, Ban, Trash2, MoreHorizontal, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { transactionsAPI } from '@/services/api';
import { toast } from 'sonner';

const Cancellation = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionMessage, setActionMessage] = useState('');
  const transactionsPerPage = 10;

  // Fonction pour charger les transactions
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionsAPI.getHistory();
      // Filtrer uniquement les transactions qui peuvent être annulées
      const allTransactions = response.data || [];
      setTransactions(allTransactions);
      console.log('🚫 Transactions rechargées:', allTransactions.length, 'transactions');
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
      toast.error('Impossible de charger les transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les transactions au montage - le key de App.jsx force le remontage
  useEffect(() => {
    loadTransactions();
  }, []);

  // Filtrage et recherche en temps réel
  useEffect(() => {
    let filtered = transactions;

    if (searchQuery) {
      filtered = filtered.filter(transaction =>
        transaction.numeroTransaction.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agentCompte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.agentTelephone.includes(searchQuery) ||
        transaction.distributeurCompte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.distributeurTelephone.includes(searchQuery)
      );
    }

    setFilteredTransactions(filtered);
    setCurrentPage(1);
  }, [transactions, searchQuery]);

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

  const handleCancelTransaction = async (transactionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette transaction ?')) return;
    
    try {
      await transactionsAPI.cancel(transactionId);
      toast.success('✅ Transaction annulée avec succès');
      console.log('🔄 Rechargement après annulation transaction');
      // Recharger les transactions
      await loadTransactions();
    } catch (error) {
      console.error('❌ Erreur lors de l\'annulation:', error);
      toast.error('❌ ' + (error.response?.data?.msg || 'Erreur lors de l\'annulation de la transaction'));
    }
  };

  const handleBlockTransaction = async (transactionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir bloquer cette transaction ?')) return;
    
    try {
      await transactionsAPI.block(transactionId);
      toast.success('✅ Transaction bloquée avec succès');
      console.log('🔄 Rechargement après blocage transaction');
      // Recharger les transactions
      await loadTransactions();
    } catch (error) {
      console.error('❌ Erreur lors du blocage:', error);
      toast.error('❌ ' + (error.response?.data?.msg || 'Erreur lors du blocage de la transaction'));
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible.')) return;
    
    try {
      await transactionsAPI.delete(transactionId);
      toast.success('✅ Transaction supprimée avec succès');
      console.log('🔄 Rechargement après suppression transaction');
      // Recharger les transactions
      await loadTransactions();
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast.error('❌ ' + (error.response?.data?.msg || 'Erreur lors de la suppression de la transaction'));
    }
  };

  const getCurrentPageTransactions = () => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Annulation</h1>
          <p className="text-muted-foreground">
            Gérer les annulations et blocages de transactions
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadTransactions} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Rafraîchir
        </Button>
      </div>

      {/* Message d'action */}
      {actionMessage && (
        <Alert>
          <AlertDescription>{actionMessage}</AlertDescription>
        </Alert>
      )}

      {/* Recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Recherche de Transactions</CardTitle>
          <CardDescription>
            Recherchez par numéro de transaction, numéro de compte ou téléphone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par numéro de transaction, compte ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Liste des transactions */}
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
                key={transaction._id || transaction.id}
                className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Agent:</span>
                        <div className="text-muted-foreground">
                          {transaction.agentNom} ({transaction.agentCompte})
                          <br />
                          {transaction.agentTelephone}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Distributeur:</span>
                        <div className="text-muted-foreground">
                          {transaction.distributeurNom} ({transaction.distributeurCompte})
                          <br />
                          {transaction.distributeurTelephone}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Créé le {formatDate(transaction.createdAt)} • 
                      Modifié le {formatDate(transaction.updatedAt)}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {transaction.statut === 'complété' && (
                        <DropdownMenuItem onClick={() => handleCancelTransaction(transaction._id || transaction.id)}>
                          <XCircle className="mr-2 h-4 w-4" />
                          Annuler
                        </DropdownMenuItem>
                      )}
                      {transaction.statut !== 'bloqué' && (
                        <DropdownMenuItem onClick={() => handleBlockTransaction(transaction._id || transaction.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          Bloquer
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteTransaction(transaction._id || transaction.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {getCurrentPageTransactions().length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? 
                  `Aucune transaction trouvée pour "${searchQuery}"` : 
                  'Aucune transaction disponible'
                }
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages}
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

export default Cancellation;
