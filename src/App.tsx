import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/store/app-store";
import { AppShell } from "@/components/app/AppShell";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import NovaConsulta from "./pages/app/NovaConsulta";
import Historico from "./pages/app/Historico";
import ConsultaDetalhe from "./pages/app/ConsultaDetalhe";
import Creditos from "./pages/app/Creditos";
import { Faq } from "./pages/app/Faq";
import NotFound from "./pages/NotFound";
import RedeDeConfianca from "./pages/app/RedeDeConfianca";
import Precos from "./pages/Precos";
import FaqPage from "./pages/Faq";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner richColors />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/precos" element={<Precos />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app" element={<AppShell><NovaConsulta /></AppShell>} />
            <Route path="/app/historico" element={<AppShell><Historico /></AppShell>} />
            <Route path="/app/consulta/:id" element={<AppShell><ConsultaDetalhe /></AppShell>} />
            <Route path="/app/creditos" element={<AppShell><Creditos /></AppShell>} />
            <Route path="/app/rede-de-confianca" element={<AppShell><RedeDeConfianca /></AppShell>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
