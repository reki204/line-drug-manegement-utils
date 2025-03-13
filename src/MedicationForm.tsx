import { useState, FormEvent } from "react";
import { MedicationData } from "./api/medicationApi";
import { useMedication } from "./hooks/useMedication";

export const MedicationForm = () => {
  const { createMedication, isLoading, error } = useMedication();

  const [formData, setFormData] = useState<MedicationData>({
    name: "",
    scheduleTime: [] as string[],
    intervalHours: undefined,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [scheduleTimeInput, setscheduleTimeInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name !== "scheduleTime") {
      setFormData((prev) => ({
        ...prev,
        [name]: value || undefined,
      }));
    } else {
      setscheduleTimeInput(value);
    }
  };

  const handleAddScheduleTime = () => {
    if (scheduleTimeInput) {
      const newScheduleTimes = [
        ...formData.scheduleTime!,
        scheduleTimeInput,
      ].sort();

      setFormData((prev) => ({
        ...prev,
        scheduleTime: newScheduleTimes,
      }));
      setscheduleTimeInput("");
    }
  };

  const handleRemoveTime = (timeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      scheduleTime: prev.scheduleTime!.filter((time) => time !== timeToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await createMedication(formData);
      setSuccessMessage(result);
      setFormData({ name: "", scheduleTime: [], intervalHours: undefined });
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
                onChange={handleChange}
                placeholder="例: アスピリン"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label
                htmlFor="scheduleTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                服用時間
                <br />
                ※入力し終わったら必ず「追加」を押してください
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  id="scheduleTime"
                  name="scheduleTime"
                  value={scheduleTimeInput}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
                />
                <button
                  type="button"
                  onClick={handleAddScheduleTime}
                  className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600"
                >
                  追加
                </button>
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
                onChange={handleChange}
                min="1"
                max="24"
                placeholder="例: 8"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
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
