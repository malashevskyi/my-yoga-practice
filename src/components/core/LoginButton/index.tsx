import { Button, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../lib/firebase";
import { toast } from "sonner";

interface LoginButtonProps {
  variant?: "text" | "outlined" | "contained";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
}

export function LoginButton({
  variant = "contained",
  fullWidth = false,
  size = "medium",
}: LoginButtonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(t("auth.loginError"));
    }
  };

  // Mobile: Show icon button
  if (isMobile) {
    return (
      <IconButton onClick={handleLogin} size="large">
        <LoginIcon />
      </IconButton>
    );
  }

  // Desktop/Tablet: Show text button
  return (
    <Button
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      onClick={handleLogin}
    >
      {t("auth.login")}
    </Button>
  );
}
