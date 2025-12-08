import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { WifiOff as WifiOffIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useOnlineStatus } from "../../../hooks/useOnlineStatus";

interface OfflineWrapperProps {
  children: ReactNode;
  fallbackMessage?: string;
}

export function OfflineWrapper({
  children,
  fallbackMessage,
}: OfflineWrapperProps) {
  const { t } = useTranslation();
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          px: 3,
          textAlign: "center",
        }}
      >
        <WifiOffIcon
          sx={{
            fontSize: 64,
            color: "text.secondary",
            mb: 2,
            opacity: 0.5,
          }}
        />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {t("offline.title")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {fallbackMessage || t("offline.defaultMessage")}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
