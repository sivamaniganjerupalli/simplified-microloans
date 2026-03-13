import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Bell, Plus, Trash2, Clock3, Volume2, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../../utils/constants";

const VendorReminderCenter = () => {
  const token = localStorage.getItem("token");
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("09:00");
  const [reminders, setReminders] = useState([]);

  const fetchReminders = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/reminders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const mapped = (res.data?.reminders || []).map((r) => ({
        id: r._id,
        title: r.title,
        time: r.time,
        done: !!r.done,
      }));
      setReminders(mapped);
    } catch {
      setReminders([]);
    }
  };

  useEffect(() => {
    fetchReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const completedCount = useMemo(() => reminders.filter((item) => item.done).length, [reminders]);

  const addReminder = async (e) => {
    e.preventDefault();
    const safeTitle = title.trim();
    if (!safeTitle || !token) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/reminders`,
        { title: safeTitle, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reminder = res.data?.reminder;
      if (reminder) {
        setReminders((prev) => [
          { id: reminder._id, title: reminder.title, time: reminder.time, done: !!reminder.done },
          ...prev,
        ]);
      }
      setTitle("");
    } catch {
      // No-op: keep current list
    }
  };

  const toggleDone = async (id) => {
    if (!token) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/reminders/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data?.reminder;
      if (updated) {
        setReminders((prev) =>
          prev.map((item) =>
            item.id === id
              ? { id: updated._id, title: updated.title, time: updated.time, done: !!updated.done }
              : item
          )
        );
      }
    } catch {
      // No-op
    }
  };

  const removeReminder = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE_URL}/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReminders((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // No-op
    }
  };

  const speakReminder = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.lang = "en-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 mb-6">
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
              <Bell className="w-4 h-4" />
              Extra Feature
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Reminder Center</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-300">
              Plan your day and never miss a repayment task.
            </p>
          </div>
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-400/30 px-4 py-3 text-right">
            <p className="text-xs text-emerald-300">Completed</p>
            <p className="text-2xl font-bold text-emerald-200">{completedCount}/{reminders.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-4">Add Reminder</h2>

          <form onSubmit={addReminder} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Task</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Example: Pay installment"
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-sm font-bold text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Save Reminder
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <h2 className="text-lg font-bold text-white mb-4">Today&apos;s Reminders</h2>

          <div className="space-y-3">
            {reminders.length === 0 && (
              <div className="rounded-2xl border border-dashed border-white/20 p-6 text-sm text-gray-400 text-center">
                No reminders yet. Add your first task.
              </div>
            )}

            {reminders.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-4 transition-colors ${
                  item.done
                    ? "border-emerald-400/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <button
                  onClick={() => toggleDone(item.id)}
                  className="rounded-full p-1 hover:bg-white/10 transition-colors"
                  aria-label="Toggle reminder status"
                >
                  <CheckCircle2 className={`w-5 h-5 ${item.done ? "text-emerald-300" : "text-gray-500"}`} />
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${item.done ? "text-emerald-200 line-through" : "text-white"}`}>
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 inline-flex items-center gap-1">
                    <Clock3 className="w-3.5 h-3.5" /> {item.time}
                  </p>
                </div>

                <button
                  onClick={() => speakReminder(`${item.title} at ${item.time}`)}
                  className="rounded-lg border border-white/15 px-2.5 py-2 text-gray-300 hover:text-white hover:bg-white/10"
                  title="Read reminder"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeReminder(item.id)}
                  className="rounded-lg border border-red-400/25 px-2.5 py-2 text-red-300 hover:bg-red-500/15"
                  title="Delete reminder"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VendorReminderCenter;
