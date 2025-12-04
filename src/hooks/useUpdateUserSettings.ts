import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import * as firebaseFunctions from "../lib/firebaseFunctions";
import { useAuthStore } from "../store/authStore";

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const setUserSettings = useAuthStore((state) => state.setUserSettings);

  return useMutation({
    mutationFn: (data: {
      tracking_project_name?: string | null;
      clockify_api_key?: string | null;
      clockify_workspace_id?: string | null;
    }) => firebaseFunctions.updateUserSettings(data),
    onSuccess: (result) => {
      // Update store
      setUserSettings({
        user: result.settings.user,
        trackingProjectName: result.settings.tracking_project_name,
        clockifyApiKey: result.settings.clockify_api_key,
        clockifyWorkspaceId: result.settings.clockify_workspace_id,
      });

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });

      toast.success(t("settings.projectUpdated"));
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error(t("settings.projectUpdateError"));
    },
  });
};
