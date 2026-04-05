import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { useLang } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Moon, Sun, Monitor, Languages, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const UserMenu = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    toast.success(t("auth.logout.success"));
    navigate("/login");
  };

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{t("user_menu.label")}</p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {themeIcons[theme]}
            <span className="ml-2">{t("user_menu.theme")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className={cn(theme === "light" && "bg-accent")}
            >
              <Sun className="h-4 w-4 mr-2" />
              {t("user_menu.theme_light")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className={cn(theme === "dark" && "bg-accent")}
            >
              <Moon className="h-4 w-4 mr-2" />
              {t("user_menu.theme_dark")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className={cn(theme === "system" && "bg-accent")}
            >
              <Monitor className="h-4 w-4 mr-2" />
              {t("user_menu.theme_system")}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Languages className="h-4 w-4" />
            <span className="ml-2">{t("user_menu.language")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem
              onClick={() => setLang("ru")}
              className={cn(lang === "ru" && "bg-accent")}
            >
              <span className="mr-2">🇷🇺</span>
              Русский
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLang("en")}
              className={cn(lang === "en" && "bg-accent")}
            >
              <span className="mr-2">🇬🇧</span>
              English
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/account")}>
          <Settings className="mr-2 h-4 w-4" />
          {t("user_menu.account")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          {t("auth.logout.button")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
