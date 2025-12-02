import { useAuthStore } from "../../../store/authStore";
import { AppDrawer } from "../AppDrawer";
import { AppDrawerGuest } from "../AppDrawerGuest";

export function AppDrawerWrapper() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <AppDrawer />;
  }

  return <AppDrawerGuest />;
}
