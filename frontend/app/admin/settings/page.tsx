"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import { Save, Settings, RefreshCw } from "lucide-react";

const API = "http://localhost:5001";

const DEFAULT: Record<string, any> = {
  platformName:       "EchoLearn",
  maintenanceMode:    false,
  registrationOpen:   true,
  maxStudentsPerClass: 40,
  voiceEnabled:       true,
  aiQuizEnabled:      true,
  supportEmail:       "support@echolearn.edu",
};

export default function AdminSettingsPage() {
  const router = useRouter();
  const [admin, setAdmin]     = useState<any>(null);
  const [settings, setSettings] = useState<Record<string, any>>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [toast, setToast]     = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const raw = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!raw || !token) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    if (u.role !== "admin") { router.push("/login"); return; }
    setAdmin(u);

    fetch(`${API}/api/admin/settings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setSettings(d || DEFAULT); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/admin/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(settings),
    });
    if (res.ok) showToast("Settings saved successfully!");
    else showToast("Failed to save settings.");
    setSaving(false);
  };

  if (!admin) return null;

  const set = (key: string, value: any) => setSettings(s => ({ ...s, [key]: value }));

  return (
    <div className="flex min-h-screen bg-[#F4F6FA]">
      <AdminNavbar adminName={admin.fullName} />

      {toast && (
        <div className="fixed top-4 right-4 z-[100] bg-[#1E2B5A] text-white px-6 py-3 rounded-xl shadow-xl font-bold text-[14px]">
          {toast}
        </div>
      )}

      <main className="ml-60 flex-1 p-10 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[32px] font-black text-[#1E2B5A]">System Settings</h1>
            <p className="text-[#8793AC] font-bold mt-1">Configure platform-wide behaviour and features.</p>
          </div>
          <button onClick={handleSave} disabled={saving || loading}
            className="flex items-center gap-2 bg-[#1E2B5A] text-white px-6 py-3 rounded-xl font-black text-[14px] shadow-lg hover:bg-[#151F41] transition disabled:opacity-50">
            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-[20px] h-20 animate-pulse border border-[#E9EDF5]" />)}</div>
        ) : (
          <div className="space-y-6">

            {/* General */}
            <section className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
              <h2 className="text-[16px] font-black text-[#1E2B5A] mb-6 flex items-center gap-2">
                <Settings size={18} /> General
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Platform Name</label>
                  <input type="text" value={settings.platformName || ""} onChange={e => set("platformName", e.target.value)}
                    className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Support Email</label>
                  <input type="email" value={settings.supportEmail || ""} onChange={e => set("supportEmail", e.target.value)}
                    className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
                </div>
                <div>
                  <label className="text-[12px] font-black text-[#8793AC] uppercase tracking-wider mb-1.5 block">Max Students Per Class</label>
                  <input type="number" min={1} max={200}
                    value={settings.maxStudentsPerClass || 40}
                    onChange={e => set("maxStudentsPerClass", Number(e.target.value))}
                    className="w-full border border-[#E9EDF5] rounded-xl px-4 py-3 text-[15px] font-bold text-[#1E2B5A] focus:outline-none focus:border-[#1E2B5A]" />
                </div>
              </div>
            </section>

            {/* Feature Flags */}
            <section className="bg-white rounded-[20px] border border-[#E9EDF5] shadow-sm p-8">
              <h2 className="text-[16px] font-black text-[#1E2B5A] mb-6">Feature Flags</h2>
              <div className="space-y-5">
                {[
                  { key: "maintenanceMode",  label: "Maintenance Mode",       desc: "Disables access for all non-admin users." },
                  { key: "registrationOpen", label: "Open Registration",       desc: "Allow new users to sign up." },
                  { key: "voiceEnabled",     label: "Voice Assistant",         desc: "Enable voice commands and TTS for students." },
                  { key: "aiQuizEnabled",    label: "AI Quiz Generation",      desc: "Allow teachers to generate quizzes with AI." },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-[#F8FAFD] rounded-xl border border-[#E9EDF5]">
                    <div>
                      <p className="text-[14px] font-black text-[#1E2B5A]">{label}</p>
                      <p className="text-[12px] font-bold text-[#8793AC] mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => set(key, !settings[key])}
                      className={`relative w-12 h-6 rounded-full transition-colors ${settings[key] ? "bg-[#1E2B5A]" : "bg-[#D5DCEB]"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${settings[key] ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-[16px] p-5">
              <p className="text-[13px] font-bold text-amber-700">
                <strong>Note:</strong> Settings are stored in memory and reset on server restart. For persistent settings, connect a Settings model to MongoDB.
              </p>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
