import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  User,
  CreditCard,
  Users,
  Settings,
  LogOut,
  ArrowLeft,
} from "lucide-react";

const navItems = [
  { to: "/account", icon: LayoutDashboard, labelKey: "account.overview" },
  { to: "/account/profile", icon: User, labelKey: "account.profile" },
  { to: "/account/subscription", icon: CreditCard, labelKey: "account.subscription" },
  { to: "/account/friends", icon: Users, labelKey: "account.friends" },
  { to: "/account/settings", icon: Settings, labelKey: "account.settings" },
];

export const AccountLayout = () => {
  const { t } = useLang();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 flex flex-col">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/friends")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("account.back_to_app")}
          </Button>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map(({ to, icon: Icon, labelKey }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/account"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {t(labelKey)}
            </NavLink>
          ))}
        </nav>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="gap-2 mt-4"
        >
          <LogOut className="h-4 w-4" />
          {t("account.logout")}
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
