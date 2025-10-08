import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Lock } from 'lucide-react';
import { authAPI } from '@/services/api';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    identifier: '', // email ou numéro de compte
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'identifier') {
      if (!value.trim()) {
        error = 'Email ou numéro de compte requis';
      } else if (value.length < 3) {
        error = 'Minimum 3 caractères';
      }
    } else if (name === 'password') {
      if (!value) {
        error = 'Mot de passe requis';
      } else if (value.length < 6) {
        error = 'Minimum 6 caractères';
      }
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validation en temps réel
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
    
    setError(''); // Effacer l'erreur globale
    console.log('📝 Saisie:', name, '=', value);
  };

  const isFormValid = () => {
    const identifierValid = formData.identifier.trim().length >= 3;
    const passwordValid = formData.password.length >= 6;
    const noErrors = !errors.identifier && !errors.password;
    return identifierValid && passwordValid && noErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider tous les champs
    const identifierError = validateField('identifier', formData.identifier);
    const passwordError = validateField('password', formData.password);
    
    if (identifierError || passwordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError
      });
      setError('Veuillez corriger les erreurs avant de continuer');
      console.log('❌ Formulaire invalide');
      return;
    }
    
    setLoading(true);
    setError('');
    console.log('🔐 Tentative de connexion...');

    try {
      // Appel API réel pour la connexion
      const response = await authAPI.login({
        identifier: formData.identifier,
        password: formData.password
      });
      // Stocker le token
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      
      console.log('✅ Connexion réussie:', user.email);
      onLogin(user);
    } catch (err) {
      console.error('❌ Erreur de connexion:', err);
      const errorMessage = err.response?.data?.msg || err.response?.data?.message || 'Identifiants invalides. Veuillez réessayer.';
      setError(errorMessage);
      console.log('❌ Message d\'erreur:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Connexion Agent</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous avec votre email ou numéro de compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="identifier">Email ou Numéro de compte</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  name="identifier"
                  type="text"
                  placeholder="agent@example.com ou AGT001"
                  value={formData.identifier}
                  onChange={handleChange}
                  className={`pl-10 ${errors.identifier ? 'border-destructive' : ''}`}
                />
                {errors.identifier && (
                  <p className="text-xs text-destructive mt-1">❌ {errors.identifier}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                />
                {errors.password && (
                  <p className="text-xs text-destructive mt-1">❌ {errors.password}</p>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !isFormValid()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold mb-2">🔐 Identifiants de test :</p>
            <p className="font-mono">Email: agent1@example.com</p>
            <p className="font-mono">Mot de passe: password123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
