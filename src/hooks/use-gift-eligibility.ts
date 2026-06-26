
import { useEffect, useState } from "react";
import { useApp } from "@/store/app-store";
import { supabase } from "@/integrations/supabase/client";

export function useGiftEligibility() {
  const { user } = useApp();
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const checkEligibility = async () => {
      try {
        const { count: queriesCount, error: queriesError } = await supabase
          .from("queries")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (queriesError) {
          throw queriesError;
        }

        const { count: contactsCount, error: contactsError } = await supabase
          .from("emergency_contacts")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (contactsError) {
          throw contactsError;
        }

        setIsEligible(queriesCount === 0 && contactsCount === 0);
      } catch (error) {
        console.error("Error checking gift eligibility:", error);
        setIsEligible(false);
      } finally {
        setLoading(false);
      }
    };

    checkEligibility();
  }, [user]);

  return { isEligible, loading };
}
