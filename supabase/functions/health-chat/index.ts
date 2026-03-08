import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user's profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Fetch recent health readings (last 24 hours)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: healthReadings } = await supabase
      .from("health_readings")
      .select("*")
      .eq("user_id", user.id)
      .gte("recorded_at", since)
      .order("recorded_at", { ascending: false })
      .limit(50);

    // Build context about user's health
    let healthContext = "";
    if (healthReadings && healthReadings.length > 0) {
      const latest = healthReadings[0];
      const avgHR = Math.round(healthReadings.reduce((s, r) => s + Number(r.heart_rate), 0) / healthReadings.length);
      const avgSpO2 = Math.round(healthReadings.reduce((s, r) => s + Number(r.spo2), 0) / healthReadings.length);
      const avgTemp = (healthReadings.reduce((s, r) => s + Number(r.temperature), 0) / healthReadings.length).toFixed(1);

      healthContext = `
بيانات المستخدم الصحية (آخر 24 ساعة):
- آخر قراءة: نبض القلب ${latest.heart_rate} BPM، أكسجين الدم ${latest.spo2}%، الحرارة ${latest.temperature}°C
- متوسط نبض القلب: ${avgHR} BPM
- متوسط أكسجين الدم: ${avgSpO2}%
- متوسط الحرارة: ${avgTemp}°C
- عدد القراءات المسجلة: ${healthReadings.length}
`;
    } else {
      healthContext = "لا توجد قراءات صحية مسجلة للمستخدم حالياً.";
    }

    const userName = profile?.display_name || user.email?.split("@")[0] || "المستخدم";

    const systemPrompt = `أنت مساعد صحي ذكي لتطبيق VitaRing - خاتم صحي ذكي يراقب العلامات الحيوية.
اسم المستخدم: ${userName}

${healthContext}

تعليمات:
- تحدث بالعربية بشكل ودود ومهني
- قدم نصائح صحية عامة بناءً على البيانات المتاحة
- لا تقدم تشخيصات طبية - انصح بزيارة الطبيب للمخاوف الجدية
- كن مختصراً ومفيداً
- استخدم الإيموجي لجعل المحادثة ودودة 💪❤️
- إذا سأل المستخدم عن بياناته، اعرضها بشكل واضح`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
