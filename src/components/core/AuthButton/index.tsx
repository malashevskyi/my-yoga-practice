import { IconButton, CircularProgress } from "@mui/material";
import { Login as LoginIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { signInWithPopup, signOut } from "firebase/auth";
import { toast } from "sonner";
import { auth, googleProvider } from "../../../lib/firebase";
import { useAuthStore } from "../../../store/authStore";

export function AuthButton() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  const handleLogin = async () => {
    try {
      // onAuthStateChanged in useAuthInit hook will handle the rest
      await signInWithPopup(auth, googleProvider);
      // Don't show toast here - wait for auth state change
    } catch (error) {
      console.error("❌ Login error:", error);
      toast.error("Failed to login");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("❌ Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <IconButton size="large" disabled>
        <CircularProgress size={24} />
      </IconButton>
    );
  }

  return (
    <IconButton
      onClick={user ? handleLogout : handleLogin}
      size="large"
      sx={{
        bgcolor: "action.hover",
        "&:hover": {
          bgcolor: "action.selected",
        },
      }}
    >
      {user ? <LogoutIcon /> : <LoginIcon />}
    </IconButton>
  );
}
