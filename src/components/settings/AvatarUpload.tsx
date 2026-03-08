import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AvatarUploadProps {
  userId: string;
  avatarUrl: string | null;
  onUploaded: (url: string) => void;
}

export function AvatarUpload({ userId, avatarUrl, onUploaded }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    // Add cache-busting param
    const freshUrl = `${publicUrl}?t=${Date.now()}`;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: freshUrl, updated_at: new Date().toISOString() })
      .eq("id", userId);

    setUploading(false);

    if (updateError) {
      toast.error("Failed to save avatar");
    } else {
      onUploaded(freshUrl);
      toast.success("Avatar updated");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="relative w-16 h-16 rounded-full overflow-hidden bg-muted border-2 border-border hover:border-primary/50 transition-colors group"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Camera className="w-6 h-6" />
          </div>
        )}
        <div className="absolute inset-0 bg-background/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          ) : (
            <Camera className="w-5 h-5 text-primary" />
          )}
        </div>
      </button>
      <div className="text-xs text-muted-foreground">
        <p className="font-medium text-foreground text-sm">Profile Photo</p>
        <p>Click to upload · JPG, PNG · Max 2MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
