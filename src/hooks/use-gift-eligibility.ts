
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
        const { count, error } = await supabase
          .from("queries")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        setIsEligible(count === 0);
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
