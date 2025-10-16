import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index"; // Agora é MinhasHistorias
import CriarHistoria from "./pages/CriarHistoria";
import NotFound from "./pages/NotFound";
import VisualizadorHistoria from "./pages/VisualizadorHistoria";
import Login from "./pages/Login";
import AuthLayout from "./layouts/AuthLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/historia/:id" element={<VisualizadorHistoria />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Index />} /> {/* Dashboard */}
            <Route path="/create" element={<CriarHistoria />} /> {/* Criação */}
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;