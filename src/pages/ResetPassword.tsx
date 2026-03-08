import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a recovery session from the URL hash
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      // Supabase will auto-set the session from the hash
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      toast.success("تم تحديث كلمة المرور بنجاح!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">VitaRing</h1>
          <p className="text-sm text-muted-foreground">إعادة تعيين كلمة المرور</p>
        </div>

        {success ? (
          <div className="glass-card p-6 flex flex-col items-center gap-4">
            <CheckCircle className="w-12 h-12 text-primary" />
            <p className="text-sm text-foreground text-center">تم تحديث كلمة المرور! جاري التحويل...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground text-center">كلمة مرور جديدة</h2>

            <div className="space-y-3">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="كلمة المرور الجديدة"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              تحديث كلمة المرور
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
