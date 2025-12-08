import { Box, Chip } from "@mui/material";
import { WifiOff as WifiOffIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";

export function OfflineStatusIndicator() {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 8,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: (theme) => theme.zIndex.snackbar + 1,
      }}
    >
      <Chip
        icon={<WifiOffIcon />}
        label={t("offline.title")}
        color="warning"
        size="small"
        sx={{
          backdropFilter: "blur(10px)",
        }}
      />
    </Box>
  );
}
