import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { fetchHistory } from "@/services/healthDataService";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Settings, User, Bell, Download, Save, Loader2, Check, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/settings/AvatarUpload";

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Notification prefs (local for now)
  const [notifHighHR, setNotifHighHR] = useState(true);
  const [notifLowSpO2, setNotifLowSpO2] = useState(true);
  const [notifFever, setNotifFever] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data?.display_name) setDisplayName(data.display_name);
      });

    // Load notification prefs from localStorage
    const prefs = localStorage.getItem("vitaring_notif_prefs");
    if (prefs) {
      const p = JSON.parse(prefs);
      setNotifHighHR(p.highHR ?? true);
      setNotifLowSpO2(p.lowSpO2 ?? true);
      setNotifFever(p.fever ?? true);
    }
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated");
    }
  };

  const saveNotifPrefs = () => {
    localStorage.setItem(
      "vitaring_notif_prefs",
      JSON.stringify({ highHR: notifHighHR, lowSpO2: notifLowSpO2, fever: notifFever })
    );
    toast.success("Notification preferences saved");
  };

  const exportData = async () => {
    setExporting(true);
    const readings = await fetchHistory(720); // last 30 days
    if (readings.length === 0) {
      toast.error("No data to export");
      setExporting(false);
      return;
    }
    const csv = [
      "timestamp,heart_rate,spo2,temperature",
      ...readings.map(r =>
        `${r.timestamp.toISOString()},${r.heartRate},${r.spo2},${r.temperature}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vitaring-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    toast.success("Data exported successfully");
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">Profile, notifications & data</p>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <User className="w-4 h-4 text-primary" />
          Profile
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Email</label>
            <p className="text-sm text-foreground mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            onClick={saveProfile}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </motion.div>

      {/* Theme */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sun className="w-4 h-4 text-primary" />
          Appearance
        </div>
        <div className="flex gap-2">
          {[
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                theme === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <opt.icon className="w-4 h-4" />
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Bell className="w-4 h-4 text-primary" />
          Alert Notifications
        </div>
        <div className="space-y-3">
          {[
            { label: "High Heart Rate (>120 BPM)", checked: notifHighHR, set: setNotifHighHR },
            { label: "Low Blood Oxygen (<92%)", checked: notifLowSpO2, set: setNotifLowSpO2 },
            { label: "Fever Alert (>38°C)", checked: notifFever, set: setNotifFever },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground">{item.label}</span>
              <button
                onClick={() => item.set(!item.checked)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  item.checked ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-foreground transition-transform ${
                    item.checked ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </label>
          ))}
          <button
            onClick={saveNotifPrefs}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            <Check className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </motion.div>

      {/* Data Export */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Download className="w-4 h-4 text-primary" />
          Data Export
        </div>
        <p className="text-xs text-muted-foreground">Download your health readings as a CSV file (last 30 days).</p>
        <button
          onClick={exportData}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors disabled:opacity-50"
        >
          {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          Export CSV
        </button>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
