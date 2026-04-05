import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AccountLayout } from "@/components/account/AccountLayout";
import { AccountOverview } from "@/pages/AccountOverview";
import { AccountProfile } from "@/pages/AccountProfile";
import { AccountSubscription } from "@/pages/AccountSubscription";
import { AccountFriends } from "@/pages/AccountFriends";
import { AccountSettings } from "@/pages/AccountSettings";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Friends from "./pages/Friends.tsx";
import Chat from "./pages/Chat.tsx";
import CreateFriend from "./pages/CreateFriend.tsx";
import SubscriptionSuccess from "./pages/SubscriptionSuccess.tsx";
import SubscriptionCancel from "./pages/SubscriptionCancel.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ai-friend-theme">
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <Friends />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:friendId?"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-friend"
                element={
                  <ProtectedRoute>
                    <CreateFriend />
                  </ProtectedRoute>
                }
              />
              <Route path="/subscription/success" element={<SubscriptionSuccess />} />
              <Route path="/subscription/cancel" element={<SubscriptionCancel />} />

              {/* Account routes */}
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AccountOverview />} />
                <Route path="profile" element={<AccountProfile />} />
                <Route path="subscription" element={<AccountSubscription />} />
                <Route path="friends" element={<AccountFriends />} />
                <Route path="settings" element={<AccountSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
