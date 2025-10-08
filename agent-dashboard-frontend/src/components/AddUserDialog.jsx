import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usersAPI } from '@/services/api';
import { toast } from 'sonner';
import { Loader2, Upload, X } from 'lucide-react';

const AddUserDialog = ({ open, onOpenChange, onUserAdded }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    numeroCompte: '',
    telephone: '',
    role: 'client',
    photo: ''
  });

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      if (open) {
        onOpenChange(false);
      }
    };
  }, []);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nom':
      case 'prenom':
        if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(value) && value) {
          error = 'Lettres uniquement (pas de chiffres ni symboles)';
        }
        break;
      case 'telephone':
        if (!/^[0-9+\s-]*$/.test(value) && value) {
          error = 'Chiffres, +, - et espaces uniquement';
        }
        break;
      case 'numeroCompte':
        if (value.length > 0 && value.length < 8) {
          error = 'Minimum 8 caractères';
        } else if (value && !/\d/.test(value)) {
          error = 'Doit contenir au moins un chiffre';
        } else if (value && !/^[a-zA-Z0-9]+$/.test(value)) {
          error = 'Lettres et chiffres uniquement';
        }
        break;
      case 'password':
        if (value.length > 0 && value.length < 6) {
          error = 'Minimum 6 caractères';
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Email invalide';
        }
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Filtrer les caractères non autorisés en temps réel
    let filteredValue = value;
    
    if (name === 'nom' || name === 'prenom') {
      filteredValue = value.replace(/[^a-zA-ZÀ-ÿ\s-]/g, '');
    } else if (name === 'telephone') {
      filteredValue = value.replace(/[^0-9+\s-]/g, '');
    } else if (name === 'numeroCompte') {
      filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
    }
    
    setFormData({
      ...formData,
      [name]: filteredValue
    });

    // Valider le champ
    const error = validateField(name, filteredValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleRoleChange = (value) => {
    console.log('🔄 Changement de rôle:', value);
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        console.log('❌ Type de fichier invalide:', file.type);
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille de l\'image ne doit pas dépasser 5 MB');
        console.log('❌ Fichier trop volumineux:', file.size, 'bytes');
        return;
      }

      setPhotoFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData({ ...formData, photo: reader.result });
        console.log('✅ Photo chargée:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData({ ...formData, photo: '' });
    console.log('🗑️ Photo supprimée');
  };

  const generateAccountNumber = () => {
    const prefix = {
      client: 'CLI',
      agent: 'AGT',
      distributeur: 'DIS'
    }[formData.role];
    
    const number = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const newNumeroCompte = `${prefix}${number}`;
    console.log('🔢 Numéro de compte généré:', newNumeroCompte, 'pour rôle:', formData.role);
    setFormData(prev => ({ ...prev, numeroCompte: newNumeroCompte }));
  };

  const isFormValid = () => {
    // Vérifier que tous les champs requis sont remplis
    const requiredFields = ['nom', 'prenom', 'email', 'password', 'numeroCompte', 'telephone'];
    const allFilled = requiredFields.every(field => formData[field].trim() !== '');
    
    // Vérifier qu'il n'y a pas d'erreurs
    const noErrors = Object.values(errors).every(error => error === '' || error === undefined);
    
    return allFilled && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }
    
    setLoading(true);

    try {
      console.log('📤 Envoi données utilisateur:', { ...formData, password: '***' });
      await usersAPI.create(formData);
      toast.success('✅ Utilisateur créé avec succès');
      onUserAdded();
      onOpenChange(false);
      // Reset form
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        numeroCompte: '',
        telephone: '',
        role: 'client',
        photo: ''
      });
      setErrors({});
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Erreur lors de la création';
      toast.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un utilisateur</DialogTitle>
          <DialogDescription>
            Créer un nouveau compte utilisateur
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom <span className="text-destructive">*</span></Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  className={errors.nom ? 'border-destructive' : ''}
                  required
                />
                {errors.nom && (
                  <p className="text-xs text-destructive">❌ {errors.nom}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom <span className="text-destructive">*</span></Label>
                <Input
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  className={errors.prenom ? 'border-destructive' : ''}
                  required
                />
                {errors.prenom && (
                  <p className="text-xs text-destructive">❌ {errors.prenom}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-destructive' : ''}
                required
              />
              {errors.email && (
                <p className="text-xs text-destructive">❌ {errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'border-destructive' : ''}
                required
              />
              {errors.password && (
                <p className="text-xs text-destructive">❌ {errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rôle <span className="text-destructive">*</span></Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full" id="role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent className="z-[100000]">
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="distributeur">Distributeur</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Rôle sélectionné: <span className="font-semibold capitalize">{formData.role}</span>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="numeroCompte">Numéro de compte <span className="text-destructive">*</span></Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateAccountNumber}
                >
                  Générer
                </Button>
              </div>
              <Input
                id="numeroCompte"
                name="numeroCompte"
                value={formData.numeroCompte}
                onChange={handleChange}
                className={errors.numeroCompte ? 'border-destructive' : ''}
                placeholder="CLI001234"
                required
              />
              {errors.numeroCompte && (
                <p className="text-xs text-destructive">❌ {errors.numeroCompte}</p>
              )}
              <p className="text-xs text-muted-foreground">Min 8 caractères, lettres et chiffres, au moins 1 chiffre</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone <span className="text-destructive">*</span></Label>
              <Input
                id="telephone"
                name="telephone"
                type="tel"
                value={formData.telephone}
                onChange={handleChange}
                className={errors.telephone ? 'border-destructive' : ''}
                placeholder="+221 77 123 45 67"
                required
              />
              {errors.telephone && (
                <p className="text-xs text-destructive">❌ {errors.telephone}</p>
              )}
            </div>

            {/* Photo de profil */}
            <div className="space-y-2">
              <Label>Photo de profil (optionnel)</Label>
              <div className="flex items-center gap-4">
                {/* Prévisualisation */}
                <Avatar className="h-20 w-20">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Prévisualisation" />
                  ) : (
                    <AvatarFallback className="bg-muted">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Boutons */}
                <div className="flex-1 space-y-2">
                  {!photoPreview ? (
                    <div>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="photo"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Choisir une image
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, GIF (max 5 MB)
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        ✅ Photo chargée
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removePhoto}
                        className="h-8 px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !isFormValid()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement en cours...
                </>
              ) : (
                'Ajouter l\'utilisateur'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
