
import { useEffect, useState } from "react";
import { useApp } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GiftAlert } from "@/components/app/GiftAlert";
import { useGiftEligibility } from "@/hooks/use-gift-eligibility";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GiftModal } from "@/components/app/GiftModal";

interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

export default function RedeDeConfianca() {
  const { user } = useApp();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({ name: "", phone: "" });
  const [showGiftModal, setShowGiftModal] = useState(false);
  const { isEligible: isEligibleForGift } = useGiftEligibility();

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  const fetchContacts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Erro ao buscar contatos de emergência.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    let formattedValue = "";
    if (value.length > 0) {
      formattedValue = "(";
      formattedValue += value.substring(0, 2);
    }
    if (value.length >= 3) {
      formattedValue += ") ";
      formattedValue += value.substring(2, 7);
    }
    if (value.length > 7) {
      formattedValue += "-";
      formattedValue += value.substring(7, 11);
    }
    setNewContact({ ...newContact, phone: formattedValue });
  };

  const handleAddContact = async () => {
    if (!user) return;
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      toast.error("Preencha o nome e o telefone do contato.");
      return;
    }

    const phoneDigits = newContact.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith("9", 2)) {
      toast.error("O telefone deve estar no formato (XX) 9XXXX-XXXX.");
      return;
    }

    try {
      const wasFirstContact = contacts.length === 0;

      const formattedPhone = `+55${phoneDigits}`;
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert([{ name: newContact.name, phone: formattedPhone, user_id: user.id }])
        .select();

      if (error) throw error;
      if (data) {
        setContacts([data[0], ...contacts]);
        setNewContact({ name: "", phone: "" });
        toast.success("Contato adicionado com sucesso!");

        if (wasFirstContact) {
          const { count, error } = await supabase
            .from("queries")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id);

          if (error) {
            console.error("Error fetching queries:", error);
            return;
          }

          if (count === 0) {
            setShowGiftModal(true);
          }
        }
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      toast.error("Erro ao adicionar contato.");
    }
  };

  const handleDeleteContact = async (id: number) => {
    try {
      const { error } = await supabase.from("emergency_contacts").delete().eq("id", id);
      if (error) throw error;
      setContacts(contacts.filter((contact) => contact.id !== id));
      toast.success("Contato removido com sucesso!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      toast.error("Erro ao remover contato.");
    }
  };

  return (
    <>
      <GiftModal
        open={showGiftModal}
        onOpenChange={setShowGiftModal}
        checkoutUrl="https://payment-link-v3.pagar.me/pl_pD4P1el5WJ8RaaoTECq4RvoGVAmnE972"
      />
      <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
        <header>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Rede de Confiança
        </h1>
        <p className="mt-2 max-w-xl text-foreground/70">
          Cadastre aqui os contatos que você deseja acionar em caso de emergência.
        </p>
      </header>

      {isEligibleForGift && <GiftAlert />}

      <Card className="p-6 shadow-soft">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Adicionar Novo Contato</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={newContact.name}
                onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                placeholder="Nome do contato"
                className="h-12 rounded-2xl text-base"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={newContact.phone}
                onChange={handlePhoneChange}
                placeholder="(XX) 9XXXX-XXXX"
                className="h-12 rounded-2xl text-base"
                maxLength={15}
              />
            </div>
          </div>
          <Button onClick={handleAddContact} className="w-full rounded-full sm:w-auto">
            Adicionar Contato
          </Button>
        </div>
      </Card>

      <Card className="p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Sua Rede de Contatos</h2>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : contacts.length > 0 ? (
          <ul className="mt-4 space-y-4">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{formatPhoneForDisplay(contact.phone)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteContact(contact.id)}>
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-center text-muted-foreground">
            Você ainda não cadastrou nenhum contato de emergência.
          </p>
        )}
        </Card>
      </div>
    </>
  );
}

function formatPhoneForDisplay(phone: string) {
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length === 13) { // +55XXXXXXXXXXX
        const ddd = phoneDigits.substring(2, 4);
        const firstPart = phoneDigits.substring(4, 9);
        const secondPart = phoneDigits.substring(9);
        return `(${ddd}) ${firstPart}-${secondPart}`;
    }
    if (phoneDigits.length === 11) {
        const ddd = phoneDigits.substring(0, 2);
        const firstPart = phoneDigits.substring(2, 7);
        const secondPart = phoneDigits.substring(7);
        return `(${ddd}) ${firstPart}-${secondPart}`;
    }
    return phone;
}
