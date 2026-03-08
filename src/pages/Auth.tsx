import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني!");
        setMode("login");
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحباً بعودتك!");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("تحقق من بريدك الإلكتروني لتأكيد حسابك!");
      }
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
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">VitaRing</h1>
          <p className="text-sm text-muted-foreground">Smart Health Ring Companion</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground text-center">
            {mode === "login" ? "تسجيل الدخول" : mode === "signup" ? "إنشاء حساب" : "نسيت كلمة المرور"}
          </h2>

          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            )}
          </div>

          {mode === "login" && (
            <div className="text-left">
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-xs text-primary hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl gradient-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {mode === "login" ? "تسجيل الدخول" : mode === "signup" ? "إنشاء حساب" : "إرسال رابط التعيين"}
          </button>

          {mode === "forgot" ? (
            <p className="text-center text-xs text-muted-foreground">
              <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" /> العودة لتسجيل الدخول
              </button>
            </p>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              {mode === "login" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-primary hover:underline"
              >
                {mode === "login" ? "إنشاء حساب" : "تسجيل الدخول"}
              </button>
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
