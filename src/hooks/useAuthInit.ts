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
        try {
          if (navigator.onLine) {
            const { user } = await createOrUpdateUser();

            setUser({
              id: user.id,
              email: user.email,
              displayName: user.display_name,
              createdAt: user.created_at,
            });

            const { settings } = await getUserSettings();
            setUserSettings({
              user: settings.user,
              trackingProjectName: settings.tracking_project_name,
              clockifyApiKey: settings.clockify_api_key,
              clockifyWorkspaceId: settings.clockify_workspace_id,
            });

            if (!isInitialLoad) toast.success(t("auth.loginSuccess"));
          } else {
            // === OFFLINE MODE ===
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName,
              createdAt: firebaseUser.metadata.creationTime!,
            });

            toast.info("Offline mode active");
          }
        } catch (error) {
          console.error("❌ Error syncing:", error);

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName,
            createdAt: firebaseUser.metadata.creationTime!,
          });
        }
      } else {
        setUser(null);
        setUserSettings(null);
      }

      setLoading(false);
      isInitialLoad = false;
    });

    return () => unsubscribe();
  }, [setUser, setUserSettings, setLoading, t]);
}
