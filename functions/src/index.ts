/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions/v2";

setGlobalOptions({ maxInstances: 10 });

// Auth
export { createOrUpdateUser } from "./auth/createOrUpdateUser";

// Settings
export { getUserSettings } from "./settings/getUserSettings";
export { updateUserSettings } from "./settings/updateUserSettings";

// Presets
export { getPresets } from "./presets/getPresets";
export { createPreset } from "./presets/createPreset";
export { deletePreset } from "./presets/deletePreset";

// Videos
export { getVideos } from "./videos/getVideos";
export { createVideo } from "./videos/createVideo";

// Tracking
export { trackTime } from "./tracking/trackTime";
export { getHistory } from "./tracking/getHistory";
