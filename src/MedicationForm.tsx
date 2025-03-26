import { useState, FormEvent, useEffect } from "react";
import { MedicationData } from "./api/medicationApi";
import { useMedication } from "./hooks/useMedication";
import liff from "@line/liff";

export const MedicationForm = () => {
  const { createMedication, isLoading, error } = useMedication();
  const [formData, setFormData] = useState<MedicationData>({
    name: "",
    scheduleTime: [],
    intervalHours: 0,
  });
  const [inputMode, setInputMode] = useState<"time" | "interval">("time");
  const [scheduleTimeInput, setScheduleTimeInput] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // LIFFの初期化
  useEffect(() => {
    (async () => {
      try {
        await liff.init({ liffId: import.meta.env.VITE_LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login();
        }
      } catch (err) {
        console.error("LIFF init error:", err);
      }
    })();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mode = e.target.value as "time" | "interval";
    setInputMode(mode);
    if (mode === "time") {
      setFormData((prev) => ({ ...prev, intervalHours: 0 }));
    } else {
      setFormData((prev) => ({ ...prev, scheduleTime: [] }));
      setScheduleTimeInput("");
    }
  };

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScheduleTimeInput(e.target.value);
  };

  // 入力欄からフォーカスが外れた場合に自動追加
  const handleBlur = () => {
    if (scheduleTimeInput) {
      const newTimes = [...formData.scheduleTime!, scheduleTimeInput].sort();
      setFormData((prev) => ({ ...prev, scheduleTime: newTimes }));
      setScheduleTimeInput("");
    }
  };

  const handleRemoveTime = (time: string) => {
    setFormData((prev) => ({
      ...prev,
      scheduleTime: prev.scheduleTime!.filter((t) => t !== time),
    }));
  };

  // 服用間隔の格納
  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      intervalHours: value ? Number(value) : 0,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const submissionData: MedicationData =
      inputMode === "time"
        ? { ...formData, intervalHours: 0 }
        : { ...formData, scheduleTime: [] };

    try {
      const result = await createMedication(submissionData);
      setSuccessMessage(result);
      setFormData({ name: "", scheduleTime: [], intervalHours: 0 });
      setScheduleTimeInput("");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("error:", err);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden md:max-w-2xl">
      <div className="px-8 py-6">
        <h1 className="text-2xl font-bold text-center text-white bg-cyan-500 py-4 rounded-lg mb-8">
          お薬登録フォーム
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* お薬の名前 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              お薬の名前<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="例: アスピリン"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
            />
          </div>

          {/* 服用方法選択 */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              服用方法を選択
            </p>
            <div className="flex gap-4 justify-center">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medicationMode"
                  value="time"
                  checked={inputMode === "time"}
                  onChange={handleModeChange}
                />
                <span className="ml-2">服用時間</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="medicationMode"
                  value="interval"
                  checked={inputMode === "interval"}
                  onChange={handleModeChange}
                />
                <span className="ml-2">服用間隔（時間）</span>
              </label>
            </div>
          </div>

          {/* 服用時間 or 服用間隔 の入力 */}
          {inputMode === "time" ? (
            <div>
              <label
                htmlFor="scheduleTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                服用時間
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  id="scheduleTime"
                  name="scheduleTime"
                  value={scheduleTimeInput}
                  onChange={handleTimeInputChange}
                  onBlur={handleBlur}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.scheduleTime!.map((time) => (
                  <div
                    key={time}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span>{time}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTime(time)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label
                htmlFor="intervalHours"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                服用間隔（時間）
              </label>
              <input
                type="number"
                id="intervalHours"
                name="intervalHours"
                value={formData.intervalHours || ""}
                onChange={handleIntervalChange}
                min="1"
                max="24"
                placeholder="例: 8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              />
            </div>
          )}

          {/* 登録ボタン */}
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-3 px-4 rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
          >
            {isLoading ? "登録中..." : "登録する"}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm mt-2 bg-green-100 px-4 py-2 rounded-md">
              {successMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
