import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { auth } from "../lib/firebase";
import { useAuthStore } from "../store/authStore";
import { createOrUpdateUser } from "../lib/firebaseFunctions";

export function useAuthInit() {
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    let isInitialLoad = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          createdAt: firebaseUser.metadata.creationTime!,
        });

        // Create or update user in Supabase
        try {
          await createOrUpdateUser();
          // Show toast only on actual login, not on page load
          if (!isInitialLoad) {
            toast.success("Successfully logged in");
          }
        } catch (error) {
          console.error("❌ Error syncing user to Supabase:", error);
          toast.error("Failed to sync user data");
        }
      } else {
        // User is signed out
        setUser(null);
      }

      setLoading(false);
      isInitialLoad = false;
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [setUser, setLoading]);
}
