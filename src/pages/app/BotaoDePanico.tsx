
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/store/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, ShieldAlert, AlertCircle, Info } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const predefinedMessages = [
  "Preciso de ajuda urgente, minha segurança está em risco.",
  "Meu ex está me ameaçando, por favor, entre em contato comigo o mais rápido possível.",
  "Meu marido está me agredindo, por favor, me ajude a sair dessa situação.",
  "Estou sendo vítima de violência doméstica, por favor, me ajude.",
  "Sinto que estou sendo seguida, por favor, me ajude.",
  "Estou em um local desconhecido e me sinto insegura, por favor, me ajude.",
  "Estou em um lugar perigoso e preciso de assistência.",
];

export default function BotaoDePanico() {
  const { user } = useApp();
  const [selectedMessage, setSelectedMessage] = useState(predefinedMessages[0]);
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchContactCount = async () => {
        const { count } = await supabase
          .from("emergency_contacts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);
        setContactCount(count || 0);
      };
      fetchContactCount();
    }
  }, [user]);

  const handlePanic = async () => {
    if (!user) return;

    const message = customMessage.trim() || selectedMessage;
    if (!message) {
      toast.error("Selecione ou digite uma mensagem.");
      return;
    }

    setLoading(true);
    try {
      // 1. Get Geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      const { latitude, longitude } = position.coords;
      const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // 2. Get User Profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // 3. Send Webhook
      const webhookUrl = "https://n8n-n8n.apuc7z.easypanel.host/webhook/c18b10e5-b920-4094-bc02-b2356d49d0d3";
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_info: profile,
          location_link: googleMapsLink,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao acionar o botão de pânico.");
      }

      toast.success("Alerta de pânico enviado para sua rede de confiança!");
    } catch (error) {
      console.error("Error handling panic button:", error);
      toast.error("Não foi possível acionar o botão de pânico. Verifique sua conexão e permissões de localização.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
      <header>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Botão de Pânico
        </h1>
        <p className="mt-2 max-w-xl text-foreground/70">
          Em caso de emergência, pressione o botão abaixo para notificar sua rede de confiança.
        </p>
      </header>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Em breve!</AlertTitle>
        <AlertDescription>
          Esta funcionalidade estará disponível em breve. Entendemos a importância dessa ferramenta e estamos trabalhando para finalizar o mais rápido possível.
        </AlertDescription>
      </Alert>

      {contactCount === 0 && (
        <Card className="border-warning/30 bg-warning/5 p-5 text-warning">
            <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5" />
                <div>
                    <p className="font-medium">Você não possui contatos de emergência.</p>
                    <p className="text-sm">
                        Para usar o botão de pânico, você precisa primeiro cadastrar sua{" "}
                        <Link to="/app/rede-de-confianca" className="underline">
                            rede de confiança
                        </Link>
                        .
                    </p>
                </div>
            </div>
        </Card>
      )}

      <Card className="p-6 shadow-soft">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Escolha uma Mensagem</h2>
          <RadioGroup value={selectedMessage} onValueChange={setSelectedMessage}>
            {predefinedMessages.map((msg, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={msg} id={`msg-${index}`} />
                <Label htmlFor={`msg-${index}`}>{msg}</Label>
              </div>
            ))}
          </RadioGroup>

          <h2 className="text-lg font-semibold pt-4">Ou digite sua mensagem</h2>
          <Textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Digite sua mensagem personalizada aqui..."
            className="rounded-2xl"
          />
        </div>
      </Card>

      <div className="text-center">
        <Button
          onClick={handlePanic}
          disabled={true}
          size="lg"
          className="h-20 rounded-full bg-gray-400 text-white shadow-lg text-xl"
        >
          {loading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <>
              <ShieldAlert className="mr-4 h-8 w-8" />
              ACIONAR PÂNICO
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
