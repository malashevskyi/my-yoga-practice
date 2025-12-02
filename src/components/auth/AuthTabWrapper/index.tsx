import { Box, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../store/authStore";

interface AuthTabWrapperProps {
  children: React.ReactNode;
}

export function AuthTabWrapper({ children }: AuthTabWrapperProps) {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 300,
          gap: 2,
          p: 4,
          textAlign: "center",
        }}
      >
        <LockOutlined sx={{ fontSize: 64, color: "text.disabled" }} />
        <Typography variant="h6" color="text.secondary">
          {t("auth.loginRequired")}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {t("auth.loginRequiredDescription")}
        </Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
