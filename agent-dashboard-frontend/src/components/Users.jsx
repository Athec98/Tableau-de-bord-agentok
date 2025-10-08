import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { usersAPI } from '@/services/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle,
  MoreHorizontal,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AddUserDialog from './AddUserDialog';
import EditUserDialog from './EditUserDialog';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, user: null });
  const [confirmBlock, setConfirmBlock] = useState({ open: false, user: null });
  const [confirmDeleteMultiple, setConfirmDeleteMultiple] = useState(false);
  const usersPerPage = 10;

  // Fonction pour charger les utilisateurs
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data);
      console.log('👥 Utilisateurs rechargés:', response.data.length, 'utilisateurs');
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au montage - le key de App.jsx force le remontage
  useEffect(() => {
    loadUsers();
    
    return () => {
      // Fermer les dialogs au démontage pour éviter les erreurs de portal
      setShowAddDialog(false);
      setShowEditDialog(false);
    };
  }, []);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = users;

    // Filtrer par rôle
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Recherche
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.numeroCompte.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.telephone.includes(searchQuery)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery, roleFilter]);

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

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const currentPageUsers = getCurrentPageUsers();
    const allSelected = currentPageUsers.every(user => selectedUsers.includes(user._id));
    
    if (allSelected) {
      setSelectedUsers(prev => prev.filter(id => !currentPageUsers.map(u => u._id).includes(id)));
    } else {
      setSelectedUsers(prev => [...new Set([...prev, ...currentPageUsers.map(u => u._id)])]);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await usersAPI.toggleStatus(userId);
      toast.success('✅ Statut de l\'utilisateur mis à jour');
      console.log('🔄 Rechargement après changement de statut');
      // Recharger les utilisateurs
      await loadUsers();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Impossible de mettre à jour le statut');
    }
  };
  
  const deleteUser = async (userId) => {
    try {
      await usersAPI.delete(userId);
      toast.success('✅ Utilisateur supprimé avec succès');
      console.log('🔄 Rechargement après suppression');
      setSelectedUsers(prev => prev.filter(id => id !== userId));
      // Recharger les utilisateurs
      await loadUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Erreur lors de la suppression';
      toast.error('❌ ' + errorMsg);
    }
  };

  const deleteSelectedUsers = async () => {
    try {
      // Supprimer chaque utilisateur sélectionné
      await Promise.all(selectedUsers.map(id => usersAPI.delete(id)));
      toast.success(`✅ ${selectedUsers.length} utilisateur(s) supprimé(s)`);
      console.log('🔄 Rechargement après suppression multiple');
      setSelectedUsers([]);
      // Recharger les utilisateurs
      await loadUsers();
    } catch (error) {
      console.error('Erreur lors de la suppression multiple:', error);
      toast.error('❌ Impossible de supprimer les utilisateurs');
    }
  };

  const getCurrentPageUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Utilisateurs</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gérez les clients, agents et distributeurs
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} md:mr-2`} />
            <span className="hidden md:inline">Rafraîchir</span>
          </Button>
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="md:size-default">
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">Ajouter</span>
            <span className="hidden md:inline ml-1">un utilisateur</span>
          </Button>
        </div>
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
                  placeholder="Rechercher par nom, email, compte ou téléphone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="client">Clients</SelectItem>
                <SelectItem value="agent">Agents</SelectItem>
                <SelectItem value="distributeur">Distributeurs</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Actions en lot */}
      {selectedUsers.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {selectedUsers.length} utilisateur(s) sélectionné(s)
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setConfirmDeleteMultiple(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer la sélection
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>
            Liste des utilisateurs ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* En-tête du tableau - Desktop uniquement */}
            <div className="hidden md:flex items-center space-x-4 pb-2 border-b">
              <Checkbox
                checked={getCurrentPageUsers().length > 0 && getCurrentPageUsers().every(user => selectedUsers.includes(user._id))}
                onCheckedChange={handleSelectAll}
              />
              <div className="flex-1 grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
                <span>Utilisateur</span>
                <span>Email</span>
                <span>Compte</span>
                <span>Téléphone</span>
                <span>Rôle</span>
                <span>Actions</span>
              </div>
            </div>

            {/* Lignes des utilisateurs */}
            {getCurrentPageUsers().map((user) => (
              <div key={user._id}>
                {/* Vue Desktop */}
                <div className="hidden md:flex items-center space-x-4 py-2">
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onCheckedChange={() => handleSelectUser(user._id)}
                  />
                  <div className="flex-1 grid grid-cols-6 gap-4 items-center">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photo} alt={`${user.prenom} ${user.nom}`} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.nom, user.prenom)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.prenom} {user.nom}</div>
                        <div className="flex items-center space-x-1">
                          {user.isActive ? (
                            <CheckCircle className="h-3 w-3 text-green-500" />
                          ) : (
                            <Ban className="h-3 w-3 text-red-500" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {user.isActive ? 'Actif' : 'Bloqué'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm">{user.email}</span>
                    <span className="text-sm font-mono">{user.numeroCompte}</span>
                    <span className="text-sm">{user.telephone}</span>
                    <Badge className={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setUserToEdit(user);
                          setShowEditDialog(true);
                          console.log('✏️ Ouverture modification pour:', user.email);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmBlock({ open: true, user })}>
                        {user.isActive ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Bloquer
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Débloquer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setConfirmDelete({ open: true, user })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              {/* Vue Mobile */}
              <div className="md:hidden border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <Checkbox
                      checked={selectedUsers.includes(user._id)}
                      onCheckedChange={() => handleSelectUser(user._id)}
                    />
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photo} alt={`${user.prenom} ${user.nom}`} />
                      <AvatarFallback className="text-sm">
                        {getInitials(user.nom, user.prenom)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{user.prenom} {user.nom}</div>
                      <Badge className={`${getRoleColor(user.role)} text-xs mt-1`}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setUserToEdit(user);
                          setShowEditDialog(true);
                        }}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setConfirmBlock({ open: true, user })}>
                        {user.isActive ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Bloquer
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Débloquer
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => setConfirmDelete({ open: true, user })}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Email</div>
                    <div className="truncate">{user.email}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Téléphone</div>
                    <div className="truncate">{user.telephone}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Compte</div>
                    <div className="font-mono text-xs">{user.numeroCompte}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Statut</div>
                    <div className="flex items-center space-x-1">
                      {user.isActive ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-xs">Actif</span>
                        </>
                      ) : (
                        <>
                          <Ban className="h-3 w-3 text-red-500" />
                          <span className="text-xs">Bloqué</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ))}
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

      <AddUserDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onUserAdded={() => {
          console.log('🔄 Rechargement après ajout utilisateur');
          loadUsers();
        }}
      />

      <EditUserDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={userToEdit}
        onUserUpdated={() => {
          console.log('🔄 Rechargement après modification utilisateur');
          loadUsers();
        }}
      />

      {/* Confirmation de suppression unique */}
      <AlertDialog open={confirmDelete.open} onOpenChange={(open) => setConfirmDelete({ open, user: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{confirmDelete.user?.prenom} {confirmDelete.user?.nom}</strong> ?
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteUser(confirmDelete.user?._id);
                setConfirmDelete({ open: false, user: null });
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation de blocage/déblocage */}
      <AlertDialog open={confirmBlock.open} onOpenChange={(open) => setConfirmBlock({ open, user: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmBlock.user?.isActive ? 'Bloquer l\'utilisateur' : 'Débloquer l\'utilisateur'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmBlock.user?.isActive ? (
                <>
                  Êtes-vous sûr de vouloir bloquer <strong>{confirmBlock.user?.prenom} {confirmBlock.user?.nom}</strong> ?
                  <br />
                  L'utilisateur ne pourra plus se connecter.
                </>
              ) : (
                <>
                  Êtes-vous sûr de vouloir débloquer <strong>{confirmBlock.user?.prenom} {confirmBlock.user?.nom}</strong> ?
                  <br />
                  L'utilisateur pourra à nouveau se connecter.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toggleUserStatus(confirmBlock.user?._id);
                setConfirmBlock({ open: false, user: null });
              }}
            >
              {confirmBlock.user?.isActive ? 'Bloquer' : 'Débloquer'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation de suppression multiple */}
      <AlertDialog open={confirmDeleteMultiple} onOpenChange={setConfirmDeleteMultiple}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression multiple</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{selectedUsers.length} utilisateur(s)</strong> ?
              <br />
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteSelectedUsers();
                setConfirmDeleteMultiple(false);
              }}
            >
              Supprimer tout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
