import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { auth } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import { createOrUpdateUser, getUserSettings } from "../lib/firebaseFunctions";

export function useAuthInit() {
  const { t } = useTranslation();
  const setUser = useAuthStore((state) => state.setUser);
  const setUserSettings = useAuthStore((state) => state.setUserSettings);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let isInitialLoad = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Create or update user in Supabase
        try {
          const { user } = await createOrUpdateUser();

          // User is signed in - use data from backend
          setUser({
            id: user.id,
            email: user.email,
            displayName: user.display_name,
            createdAt: user.created_at,
          });

          // Load user settings
          try {
            const { settings } = await getUserSettings();
            setUserSettings({
              user: settings.user,
              trackingProjectName: settings.tracking_project_name,
              clockifyApiKey: settings.clockify_api_key,
              clockifyWorkspaceId: settings.clockify_workspace_id,
            });
          } catch (settingsError) {
            console.error("❌ Error loading user settings:", settingsError);
            toast.error(t("settings.loadSettingsError"));
            // Settings are optional, continue without them
            setUserSettings(null);
          }

          // Show toast only on actual login, not on page load
          if (!isInitialLoad) {
            toast.success(t("auth.loginSuccess"));
          }
        } catch (error) {
          console.error("❌ Error syncing user to Supabase:", error);
          toast.error(t("auth.syncError"));

          // Fallback to Firebase data if Supabase fails
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName,
            createdAt: firebaseUser.metadata.creationTime!,
          });
          setUserSettings(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setUserSettings(null);
      }

      setLoading(false);
      isInitialLoad = false;
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setUserSettings, setLoading, t]);
}
