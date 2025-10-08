import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  XCircle, 
  History,
  Menu,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      description: 'Vue d\'ensemble'
    },
    {
      path: '/users',
      icon: Users,
      label: 'Utilisateurs',
      description: 'Gestion des utilisateurs'
    },
    {
      path: '/deposit',
      icon: CreditCard,
      label: 'Dépôt',
      description: 'Effectuer un dépôt'
    },
    {
      path: '/cancellation',
      icon: XCircle,
      label: 'Annulation',
      description: 'Gérer les annulations'
    },
    {
      path: '/history',
      icon: History,
      label: 'Historique',
      description: 'Historique des transactions'
    }
  ];

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      isOpen ? 'w-64' : 'w-16'
    } flex flex-col`}>
      {/* Logo et titre */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">
                Agent Dashboard
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                Tableau de bord
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors group ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-sidebar-primary' : ''}`} />
                  {isOpen && (
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-60">{item.description}</div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            © 2024 Agent Dashboard
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
