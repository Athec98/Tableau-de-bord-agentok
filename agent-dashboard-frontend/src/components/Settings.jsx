import { useState } from 'react';
import { ArrowLeft, Bell, Shield, Lock, Globe, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    transactionAlerts: true,
    systemUpdates: false,
    
    // Sécurité
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '15',
    
    // Confidentialité
    profileVisible: true,
    shareData: false,
    
    // Langue et Région
    language: 'fr',
    timezone: 'Africa/Dakar',
    currency: 'XOF'
  });

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // Sauvegarder dans localStorage pour persistance
    localStorage.setItem('userSettings', JSON.stringify(settings));
    toast.success('Paramètres enregistrés avec succès');
  };

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
          <h1 className="text-3xl font-bold tracking-tight">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérer vos préférences et paramètres
          </p>
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
          </CardTitle>
          <CardDescription>
            Configurez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="emailNotifications">Notifications par email</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des notifications par email
              </p>
            </div>
            <Switch
              id="emailNotifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="smsNotifications">Notifications par SMS</Label>
              <p className="text-sm text-muted-foreground">
                Recevoir des alertes par SMS
              </p>
            </div>
            <Switch
              id="smsNotifications"
              checked={settings.smsNotifications}
              onCheckedChange={() => handleToggle('smsNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="transactionAlerts">Alertes de transaction</Label>
              <p className="text-sm text-muted-foreground">
                Être notifié lors de chaque transaction
              </p>
            </div>
            <Switch
              id="transactionAlerts"
              checked={settings.transactionAlerts}
              onCheckedChange={() => handleToggle('transactionAlerts')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="systemUpdates">Mises à jour système</Label>
              <p className="text-sm text-muted-foreground">
                Notifications des mises à jour
              </p>
            </div>
            <Switch
              id="systemUpdates"
              checked={settings.systemUpdates}
              onCheckedChange={() => handleToggle('systemUpdates')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Sécurité</span>
          </CardTitle>
          <CardDescription>
            Renforcez la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="twoFactorAuth">Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Ajouter une couche de sécurité supplémentaire
              </p>
            </div>
            <Switch
              id="twoFactorAuth"
              checked={settings.twoFactorAuth}
              onCheckedChange={() => handleToggle('twoFactorAuth')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="loginAlerts">Alertes de connexion</Label>
              <p className="text-sm text-muted-foreground">
                Être alerté lors de nouvelles connexions
              </p>
            </div>
            <Switch
              id="loginAlerts"
              checked={settings.loginAlerts}
              onCheckedChange={() => handleToggle('loginAlerts')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Délai d'expiration de session</Label>
            <Select 
              value={settings.sessionTimeout} 
              onValueChange={(value) => handleSelect('sessionTimeout', value)}
            >
              <SelectTrigger id="sessionTimeout">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutes</SelectItem>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="0">Jamais</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Temps d'inactivité avant déconnexion automatique
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Confidentialité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Confidentialité</span>
          </CardTitle>
          <CardDescription>
            Contrôlez vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="profileVisible">Profil visible</Label>
              <p className="text-sm text-muted-foreground">
                Rendre votre profil visible aux autres agents
              </p>
            </div>
            <Switch
              id="profileVisible"
              checked={settings.profileVisible}
              onCheckedChange={() => handleToggle('profileVisible')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shareData">Partager les données</Label>
              <p className="text-sm text-muted-foreground">
                Partager des données anonymes pour améliorer le service
              </p>
            </div>
            <Switch
              id="shareData"
              checked={settings.shareData}
              onCheckedChange={() => handleToggle('shareData')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Langue et Région */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>Langue et Région</span>
          </CardTitle>
          <CardDescription>
            Personnalisez les paramètres régionaux
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Langue</Label>
            <Select 
              value={settings.language} 
              onValueChange={(value) => handleSelect('language', value)}
            >
              <SelectTrigger id="language">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select 
              value={settings.timezone} 
              onValueChange={(value) => handleSelect('timezone', value)}
            >
              <SelectTrigger id="timezone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Africa/Dakar">Afrique/Dakar (GMT+0)</SelectItem>
                <SelectItem value="Africa/Abidjan">Afrique/Abidjan (GMT+0)</SelectItem>
                <SelectItem value="Africa/Lagos">Afrique/Lagos (GMT+1)</SelectItem>
                <SelectItem value="Africa/Cairo">Afrique/Le Caire (GMT+2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Select 
              value={settings.currency} 
              onValueChange={(value) => handleSelect('currency', value)}
            >
              <SelectTrigger id="currency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="XOF">Franc CFA (XOF)</SelectItem>
                <SelectItem value="EUR">Euro (EUR)</SelectItem>
                <SelectItem value="USD">Dollar US (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer les paramètres
        </Button>
      </div>
    </div>
  );
};

export default Settings;
