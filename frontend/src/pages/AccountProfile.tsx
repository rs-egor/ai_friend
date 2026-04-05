import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AccountProfile = () => {
  const { t } = useLang();
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState(user?.email || "");
  const [emailLoading, setEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setEmailLoading(true);
    try {
      await authApi.updateProfile(email);
      await refreshUser();
      toast({ title: t("profile.email_updated") });
    } catch (err: any) {
      toast({
        title: t("profile.email_error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    } finally {
      setEmailLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: t("profile.password_too_short"), variant: "destructive" });
      return;
    }

    setPasswordLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      toast({ title: t("profile.password_updated") });
    } catch (err: any) {
      toast({
        title: t("profile.password_error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await authApi.deleteAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (err: any) {
      toast({
        title: t("profile.delete_error"),
        description: err.response?.data?.detail || err.message,
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t("account.profile")}</h1>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.email")}</CardTitle>
          <CardDescription>{t("profile.email_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="flex gap-3">
            <div className="flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <Button type="submit" disabled={emailLoading}>
              {emailLoading ? t("common.saving") : t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.change_password")}</CardTitle>
          <CardDescription>{t("profile.password_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <Label htmlFor="current_password">{t("profile.current_password")}</Label>
              <Input
                id="current_password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="new_password">{t("profile.new_password")}</Label>
              <Input
                id="new_password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={passwordLoading}>
              {passwordLoading ? t("common.saving") : t("profile.change_password")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Registration date */}
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.registration_date")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          </p>
        </CardContent>
      </Card>

      {/* Delete account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {t("profile.delete_account")}
          </CardTitle>
          <CardDescription>{t("profile.delete_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">{t("profile.delete_account")}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("profile.delete_confirm_title")}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t("profile.delete_confirm_description")}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteLoading}>
                  {deleteLoading ? t("common.deleting") : t("profile.delete_account")}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
};
