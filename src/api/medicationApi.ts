import liff from "@line/liff";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface MedicationData {
  name: string;
  scheduleTime?: string[];
  intervalHours?: number;
}

export const medicationApi = {
  create: async (data: MedicationData) => {
    await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
    // ログイン後、IDトークンを取得
    const idToken = liff.getIDToken();

    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    return responseData;
  },
};
