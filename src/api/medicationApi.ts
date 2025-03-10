const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface MedicationData {
  name: string;
  scheduleTime?: string[];
  intervalHours?: number;
}

export const medicationApi = {
  create: async (data: MedicationData) => {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData;
  },
};
