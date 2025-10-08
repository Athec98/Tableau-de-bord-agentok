import { useState, useEffect } from 'react';
import { CreditCard, Building, DollarSign, RefreshCw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usersAPI, transactionsAPI } from '@/services/api';

const Deposit = () => {
  const [formData, setFormData] = useState({
    distributorId: '',
    montant: '',
    devise: 'F'
  });
  const [distributors, setDistributors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingDistributors, setLoadingDistributors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  // Fonction pour charger la liste des distributeurs
  const loadDistributors = async () => {
    setLoadingDistributors(true);
    try {
      const response = await usersAPI.getAll({ role: 'distributeur' });
      setDistributors(response.data);
      console.log('🏛️ Distributeurs rechargés:', response.data.length, 'distributeurs');
    } catch (error) {
      console.error('Erreur lors du chargement des distributeurs:', error);
      toast.error('Impossible de charger les distributeurs');
    } finally {
      setLoadingDistributors(false);
    }
  };

  // Charger les distributeurs au montage - le key de App.jsx force le remontage
  useEffect(() => {
    loadDistributors();
  }, []);

  const validateMontant = (value) => {
    let error = '';
    const montant = parseFloat(value);
    
    if (!value) {
      error = 'Montant requis';
    } else if (isNaN(montant)) {
      error = 'Montant invalide';
    } else if (montant < 500) {
      error = 'Minimum 500 F';
    } else if (montant > 1000000) {
      error = 'Maximum 1 000 000 F';
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Filtrer uniquement les chiffres pour le montant
    let filteredValue = value;
    if (name === 'montant') {
      filteredValue = value.replace(/[^0-9]/g, '');
      
      // Validation en temps réel
      const montantError = validateMontant(filteredValue);
      setErrors(prev => ({ ...prev, montant: montantError }));
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: filteredValue
    }));
    setError('');
    setSuccess('');
    console.log('📝 Saisie dépôt:', name, '=', filteredValue);
  };

  const handleDistributorChange = (value) => {
    setFormData(prev => ({
      ...prev,
      distributorId: value
    }));
    setErrors(prev => ({ ...prev, distributorId: '' }));
    setError('');
    setSuccess('');
    console.log('🏛️ Distributeur sélectionné:', value);
  };
  
  const isFormValid = () => {
    const hasDistributor = !!formData.distributorId;
    const montantValid = formData.montant && parseFloat(formData.montant) >= 500;
    const noErrors = !errors.montant && !errors.distributorId;
    return hasDistributor && montantValid && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation complète avant soumission
    const newErrors = {};
    
    if (!formData.distributorId) {
      newErrors.distributorId = 'Veuillez sélectionner un distributeur';
    }
    
    const montantError = validateMontant(formData.montant);
    if (montantError) {
      newErrors.montant = montantError;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setError('Veuillez corriger les erreurs avant de continuer');
      console.log('❌ Formulaire dépôt invalide:', newErrors);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    console.log('💰 Création du dépôt...');

    try {
      const montant = parseFloat(formData.montant);

      // Appel API réel pour créer un dépôt
      const response = await transactionsAPI.createDeposit({
        destinataireId: formData.distributorId,
        montant: montant,
        devise: formData.devise,
        typeTransaction: 'depot'
      });

      const transaction = response.data;
      
      console.log('✅ Dépôt créé:', transaction.numeroTransaction);
      setSuccess(`Dépôt effectué avec succès ! Numéro de transaction: ${transaction.numeroTransaction}`);
      toast.success('✅ Dépôt effectué avec succès');
      
      // Réinitialiser le formulaire
      setFormData({
        distributorId: '',
        montant: '',
        devise: 'F'
      });
      setErrors({});
      
    } catch (err) {
      console.error('❌ Erreur dépôt:', err);
      const errorMessage = err.response?.data?.msg || err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error('❌ ' + errorMessage);
      console.log('❌ Message d\'erreur:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedDistributor = distributors.find(d => (d.id || d._id).toString() === formData.distributorId);

  // Filtrer les distributeurs en fonction de la recherche
  const filteredDistributors = distributors.filter(distributor => {
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      distributor.nom?.toLowerCase().includes(search) ||
      distributor.prenom?.toLowerCase().includes(search) ||
      distributor.numeroCompte?.toLowerCase().includes(search) ||
      distributor.telephone?.toLowerCase().includes(search) ||
      distributor.email?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dépôt</h1>
        <p className="text-muted-foreground">
          Effectuer un dépôt vers un distributeur
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Formulaire de dépôt */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Nouveau Dépôt</span>
            </CardTitle>
            <CardDescription>
              Montant minimum: 500 F
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="distributorId">Distributeur <span className="text-destructive">*</span></Label>
                
                {/* Champ de recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un distributeur (nom, compte, téléphone...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Liste des distributeurs filtrés */}
                <div className="border rounded-md max-h-[200px] overflow-y-auto">
                  {loadingDistributors ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Chargement...
                    </div>
                  ) : filteredDistributors.length > 0 ? (
                    <div className="divide-y">
                      {filteredDistributors.map((distributor) => {
                        const distId = (distributor._id || distributor.id).toString();
                        const isSelected = formData.distributorId === distId;
                        
                        return (
                          <div
                            key={distId}
                            onClick={() => handleDistributorChange(distId)}
                            className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                              isSelected ? 'bg-primary/10 border-l-4 border-primary' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium">
                                  {distributor.prenom} {distributor.nom}
                                  {isSelected && (
                                    <Badge className="ml-2 bg-primary text-primary-foreground">
                                      Sélectionné
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {distributor.numeroCompte} • {distributor.telephone}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      {searchQuery ? `Aucun distributeur trouvé pour "${searchQuery}"` : 'Aucun distributeur disponible'}
                    </div>
                  )}
                </div>

                {errors.distributorId && (
                  <p className="text-xs text-destructive">❌ {errors.distributorId}</p>
                )}
                
                {searchQuery && (
                  <p className="text-xs text-muted-foreground">
                    {filteredDistributors.length} distributeur(s) trouvé(s)
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="montant">Montant <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="montant"
                    name="montant"
                    type="text"
                    inputMode="numeric"
                    placeholder="500"
                    value={formData.montant}
                    onChange={handleChange}
                    className={`pl-10 ${errors.montant ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.montant && (
                  <p className="text-xs text-destructive">❌ {errors.montant}</p>
                )}
                {!errors.montant && formData.montant && (
                  <p className="text-xs text-green-600">✅ Montant valide</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum: 500 F | Maximum: 1 000 000 F
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="devise">Devise</Label>
                <Select value={formData.devise} onValueChange={(value) => setFormData(prev => ({ ...prev, devise: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Franc CFA (F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading || !isFormValid()}>
                {loading ? 'Traitement en cours...' : 'Effectuer le dépôt'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations du distributeur sélectionné */}
        {selectedDistributor && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Distributeur Sélectionné</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Nom complet</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDistributor.prenom} {selectedDistributor.nom}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Numéro de compte</Label>
                  <p className="text-sm text-muted-foreground font-mono">
                    {selectedDistributor.numeroCompte}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Téléphone</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDistributor.telephone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informations importantes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations Importantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Montant Minimum</h4>
                <p className="text-sm text-muted-foreground">
                  Le montant minimum pour un dépôt est de 500 F CFA.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Traitement</h4>
                <p className="text-sm text-muted-foreground">
                  Les dépôts sont traités immédiatement et confirmés par SMS.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Historique</h4>
                <p className="text-sm text-muted-foreground">
                  Consultez l'historique des transactions pour suivre vos dépôts.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Deposit;
