import { Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { signOut } from "firebase/auth";
import { auth } from "../../../lib/firebase";
import { toast } from "sonner";
import { useAuthStore } from "../../../store/authStore";

interface LogoutButtonProps {
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
}

export function LogoutButton({
  variant = "text",
  fullWidth = false,
  size = "medium",
}: LogoutButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast.success(t("auth.logoutSuccess"));
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(t("auth.logoutError"));
    }
  };

  // Mobile: Show icon button
  if (isMobile) {
    return (
      <IconButton
        onClick={handleLogout}
        size="large"
        sx={{
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected",
          },
        }}
      >
        <LogoutIcon />
      </IconButton>
    );
  }

  // Desktop/Tablet: Show text button
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      onClick={handleLogout}
    >
      {t("auth.logout")}
    </Button>
  );
}
