'use client';
// should allow us to ask the user between the different profiles they can have (see scripts/00001_profile)
// should ask to confirm as this cannot be changed later (or can be but with some effort :D - say that too in the ui)
// nice intuative and mobile friendly ui
// should store the profile selection in the profile_config table
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ProfileSelection() {
  const [selected, setSelected] = useState<null | "candidate" | "org">(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSelect = async (type: "candidate" | "org") => {
    setSelected(type);
    setError(null);
    setLoading(true);
    setSuccess(false);
    try {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }
      // Insert into profile_config
      const { error: insertError } = await supabase
        .from("profile_config")
        .insert({
          user_id: user.id,
          is_org: type === "org",
        });
      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      console.error(e);
      setError("Failed to save profile selection.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[60vh] p-4">
      <h1 className="text-2xl font-bold text-center">Select Your Profile</h1>
      <p className="text-sm text-muted-foreground text-center">
        Choose a profile to continue. <br />
        <span className="text-warning">You cannot change this later (or only with effort).</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs mt-6">
        <button
          className={`flex-1 px-6 py-4 rounded-lg border text-lg font-semibold transition-all ${selected === "candidate" ? "bg-primary text-white" : "bg-background border-primary"}`}
          disabled={loading}
          onClick={() => handleSelect("candidate")}
        >
          Candidate
        </button>
        <button
          className={`flex-1 px-6 py-4 rounded-lg border text-lg font-semibold transition-all ${selected === "org" ? "bg-secondary text-white" : "bg-background border-secondary"}`}
          disabled={loading}
          onClick={() => handleSelect("org")}
        >
          Employer / Organization
        </button>
      </div>
      {loading && <div className="mt-4 text-primary">Saving selection...</div>}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {success && (
        <div className="mt-4 text-green-600 font-bold">Profile selection saved! You may continue.</div>
      )}
    </div>
  );
}