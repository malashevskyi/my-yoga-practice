import { useAuthStore } from "../../../store/authStore";
import { AppDrawer } from "../AppDrawer";

export function AppDrawerWrapper() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Only show drawer for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return <AppDrawer />;
}
