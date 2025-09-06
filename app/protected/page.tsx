import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import ProfileSelection from "@/components/profile-selection";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }



  const { data: profile_config, error: profileError } = await supabase
    .from('profile_config')
    .select('*');

  // If no profile, show selection
  if (!profile_config || profile_config.length === 0) {
    return (
      <div className="flex-1 w-full flex flex-col gap-12">
        <ProfileSelection />
        {profileError && (
          <div className="text-red-500">
            Error fetching profile config: {profileError.message}
          </div>
        )}
      </div>
    );
  }

  // If profile exists, redirect to dashboard
  const profile = profile_config[0];
  if (profile.is_org) {
    redirect("/dashboard/org");
  } else {
    redirect("/dashboard/candidate");
  }
}