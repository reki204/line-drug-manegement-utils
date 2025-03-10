import { useState } from "react";
import { medicationApi, MedicationData } from "../api/medicationApi";

export const useMedication = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedication = async (data: MedicationData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await medicationApi.create(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "お薬の登録に失敗しました。";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMedication,
    isLoading,
    error,
  };
};
