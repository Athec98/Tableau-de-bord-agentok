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

const EditUserDialog = ({ open, onOpenChange, user, onUserUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numeroCompte: '',
    telephone: '',
    role: 'client',
    photo: ''
  });

  // Charger les données de l'utilisateur quand le dialog s'ouvre
  useEffect(() => {
    if (user && open) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        numeroCompte: user.numeroCompte || '',
        telephone: user.telephone || '',
        role: user.role || 'client',
        photo: user.photo || ''
      });
      setPhotoPreview(user.photo || null);
      setErrors({});
      console.log('📝 Chargement utilisateur pour modification:', user.email);
    }
    
    // Cleanup au démontage
    return () => {
      if (open) {
        onOpenChange(false);
      }
    };
  }, [user, open]);

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

    console.log('✏️ Modification:', name, '=', filteredValue);
  };

  const handleRoleChange = (value) => {
    setFormData({ ...formData, role: value });
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
        console.log('✅ Photo modifiée:', file.name);
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

  const isFormValid = () => {
    // Vérifier que tous les champs requis sont remplis
    const requiredFields = ['nom', 'prenom', 'email', 'numeroCompte', 'telephone'];
    const allFilled = requiredFields.every(field => formData[field].trim() !== '');
    
    // Vérifier qu'il n'y a pas d'erreurs
    const noErrors = Object.values(errors).every(error => error === '' || error === undefined);
    
    return allFilled && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      console.log('❌ Formulaire de modification invalide');
      return;
    }
    
    setLoading(true);
    console.log('💾 Mise à jour de l\'utilisateur...');

    try {
      await usersAPI.update(user._id || user.id, formData);
      toast.success('✅ Utilisateur modifié avec succès');
      console.log('✅ Utilisateur mis à jour:', formData.email);
      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Erreur modification utilisateur:', error);
      const errorMsg = error.response?.data?.msg || error.response?.data?.message || 'Erreur lors de la modification';
      toast.error('❌ ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription>
            Modifier les informations de {user.prenom} {user.nom}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Photo de profil */}
            <div className="space-y-2">
              <Label>Photo de profil</Label>
              <div className="flex items-center gap-4">
                {/* Prévisualisation */}
                <Avatar className="h-24 w-24">
                  {photoPreview ? (
                    <AvatarImage src={photoPreview} alt="Prévisualisation" />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {formData.nom?.charAt(0)}{formData.prenom?.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>

                {/* Boutons */}
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div>
                      <Input
                        id="photo-edit"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <Label
                        htmlFor="photo-edit"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {photoPreview ? 'Changer' : 'Ajouter'}
                      </Label>
                    </div>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={removePhoto}
                      >
                        <X className="mr-2 h-4 w-4" />
                        Supprimer
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, GIF (max 5 MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom-edit">Nom <span className="text-destructive">*</span></Label>
                <Input
                  id="nom-edit"
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
                <Label htmlFor="prenom-edit">Prénom <span className="text-destructive">*</span></Label>
                <Input
                  id="prenom-edit"
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
              <Label htmlFor="email-edit">Email <span className="text-destructive">*</span></Label>
              <Input
                id="email-edit"
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
              <Label htmlFor="role-edit">Rôle</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="distributeur">Distributeur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numeroCompte-edit">Numéro de compte <span className="text-destructive">*</span></Label>
              <Input
                id="numeroCompte-edit"
                name="numeroCompte"
                value={formData.numeroCompte}
                onChange={handleChange}
                className={errors.numeroCompte ? 'border-destructive' : ''}
                placeholder="CLI001234"
                required
                disabled
              />
              {errors.numeroCompte && (
                <p className="text-xs text-destructive">❌ {errors.numeroCompte}</p>
              )}
              <p className="text-xs text-muted-foreground">Le numéro de compte ne peut pas être modifié</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone-edit">Téléphone <span className="text-destructive">*</span></Label>
              <Input
                id="telephone-edit"
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !isFormValid()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer les modifications'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
