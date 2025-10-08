import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { authAPI, usersAPI } from '@/services/api';
import { toast } from 'sonner';

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: ''
  });
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  // Charger les données du profil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await authAPI.getProfile();
        // Le backend renvoie { user: {...} }
        const userData = response.data.user || response.data;
        console.log('📋 Profil chargé:', userData);
        setUser(userData);
        setFormData({
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          telephone: userData.telephone || '',
          motDePasse: '',
          confirmMotDePasse: ''
        });
        setPhotoPreview(userData.photo || null);
      } catch (error) {
        console.error('❌ Erreur lors du chargement du profil:', error);
        toast.error('Impossible de charger le profil');
      }
    };
    loadProfile();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La taille de l\'image ne doit pas dépasser 5 MB');
        return;
      }

      setPhotoFile(file);
      
      // Créer une prévisualisation
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(user?.photo || null);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.nom)) {
      newErrors.nom = 'Le nom ne doit contenir que des lettres';
    }

    // Validation du prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(formData.prenom)) {
      newErrors.prenom = 'Le prénom ne doit contenir que des lettres';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Validation du téléphone
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9+\s-]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Téléphone invalide';
    }

    // Validation du mot de passe (si rempli)
    if (formData.motDePasse) {
      if (formData.motDePasse.length < 6) {
        newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
      }
      if (formData.motDePasse !== formData.confirmMotDePasse) {
        newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setLoading(true);
    
    try {
      const updateData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone
      };

      // Ajouter le mot de passe seulement s'il a été modifié
      if (formData.motDePasse) {
        updateData.motDePasse = formData.motDePasse;
      }

      // Ajouter la photo si elle a été modifiée
      if (photoFile) {
        const reader = new FileReader();
        reader.onloadend = async () => {
          updateData.photo = reader.result;
          await usersAPI.update(user._id, updateData);
          toast.success('✅ Profil mis à jour avec succès');
          
          // Recharger le profil
          const response = await authAPI.getProfile();
          const updatedUser = response.data.user || response.data;
          setUser(updatedUser);
          setPhotoPreview(updatedUser.photo || null);
          setPhotoFile(null);
          
          // Réinitialiser les champs de mot de passe
          setFormData(prev => ({
            ...prev,
            motDePasse: '',
            confirmMotDePasse: ''
          }));
          setLoading(false);
        };
        reader.readAsDataURL(photoFile);
      } else {
        await usersAPI.update(user._id, updateData);
        toast.success('✅ Profil mis à jour avec succès');
        
        // Recharger le profil
        const response = await authAPI.getProfile();
        const updatedUser = response.data.user || response.data;
        setUser(updatedUser);
        
        // Réinitialiser les champs de mot de passe
        setFormData(prev => ({
          ...prev,
          motDePasse: '',
          confirmMotDePasse: ''
        }));
        setLoading(false);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(error.response?.data?.msg || 'Erreur lors de la mise à jour du profil');
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mon Profil</h1>
          <p className="text-muted-foreground">
            Gérer vos informations personnelles
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Carte Avatar */}
        <Card>
          <CardHeader>
            <CardTitle>Photo de profil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={photoPreview} alt={`${user.prenom} ${user.nom}`} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                {user.nom?.charAt(0)}{user.prenom?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            {!photoFile ? (
              <>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Label
                  htmlFor="photo-upload"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 cursor-pointer"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Changer la photo
                </Label>
                <p className="text-xs text-muted-foreground text-center">
                  JPG, PNG, GIF (max 5 MB)
                </p>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="sm" onClick={removePhoto}>
                  <X className="mr-2 h-4 w-4" />
                  Annuler
                </Button>
                <p className="text-xs text-muted-foreground">
                  ✅ Photo modifiée
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulaire de modification */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>
              Mettez à jour vos informations. Les champs marqués d'un * sont obligatoires.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom */}
                <div className="space-y-2">
                  <Label htmlFor="nom">
                    Nom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    pattern="[a-zA-ZÀ-ÿ\s-]+"
                    title="Lettres uniquement"
                    className={errors.nom ? 'border-destructive' : ''}
                  />
                  {errors.nom && (
                    <p className="text-xs text-destructive">{errors.nom}</p>
                  )}
                </div>

                {/* Prénom */}
                <div className="space-y-2">
                  <Label htmlFor="prenom">
                    Prénom <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="prenom"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    pattern="[a-zA-ZÀ-ÿ\s-]+"
                    title="Lettres uniquement"
                    className={errors.prenom ? 'border-destructive' : ''}
                  />
                  {errors.prenom && (
                    <p className="text-xs text-destructive">{errors.prenom}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <Label htmlFor="telephone">
                    Téléphone <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="telephone"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    pattern="[0-9+\s-]+"
                    title="Numéro de téléphone"
                    className={errors.telephone ? 'border-destructive' : ''}
                  />
                  {errors.telephone && (
                    <p className="text-xs text-destructive">{errors.telephone}</p>
                  )}
                </div>

                {/* Numéro de compte (non modifiable) */}
                <div className="space-y-2">
                  <Label htmlFor="numeroCompte">Numéro de compte</Label>
                  <Input
                    id="numeroCompte"
                    value={user.numeroCompte}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le numéro de compte ne peut pas être modifié
                  </p>
                </div>

                {/* Rôle (non modifiable) */}
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Input
                    id="role"
                    value={user.role}
                    disabled
                    className="bg-muted capitalize"
                  />
                  <p className="text-xs text-muted-foreground">
                    Le rôle ne peut pas être modifié
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-6">
                <h3 className="text-lg font-semibold mb-4">Changer le mot de passe</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nouveau mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="motDePasse">Nouveau mot de passe</Label>
                    <Input
                      id="motDePasse"
                      name="motDePasse"
                      type="password"
                      value={formData.motDePasse}
                      onChange={handleChange}
                      placeholder="Laisser vide pour ne pas changer"
                      className={errors.motDePasse ? 'border-destructive' : ''}
                    />
                    {errors.motDePasse && (
                      <p className="text-xs text-destructive">{errors.motDePasse}</p>
                    )}
                  </div>

                  {/* Confirmer mot de passe */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmMotDePasse">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmMotDePasse"
                      name="confirmMotDePasse"
                      type="password"
                      value={formData.confirmMotDePasse}
                      onChange={handleChange}
                      placeholder="Confirmer le nouveau mot de passe"
                      className={errors.confirmMotDePasse ? 'border-destructive' : ''}
                    />
                    {errors.confirmMotDePasse && (
                      <p className="text-xs text-destructive">{errors.confirmMotDePasse}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Enregistrer les modifications
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
