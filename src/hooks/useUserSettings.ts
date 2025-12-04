import { useQuery } from "@tanstack/react-query";
import * as firebaseFunctions from "../lib/firebaseFunctions";

export const useUserSettings = () => {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const result = await firebaseFunctions.getUserSettings();
      return result.settings;
    },
  });
};
