import type { Preset } from "../types/preset";

export const DEFAULT_PRESETS: Preset[] = [
  {
    id: "default-1",
    name: "preset1Name", // Translation key
    description: "",
    steps: [
      { id: "1-1", type: "timer", label: "Kirtan", duration: 600 },
      { id: "1-2", type: "timer", label: "Meditation", duration: 1200 },
    ],
    duration_total: 1800,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    name: "preset2Name", // Translation key
    description: "",
    steps: [
      { id: "2-1", type: "timer", label: "Kirtan", duration: 1200 },
      { id: "2-2", type: "timer", label: "Meditation", duration: 1200 },
    ],
    duration_total: 2400,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    name: "preset3Name", // Translation key
    description: "",
    steps: [
      { id: "3-1", type: "timer", label: "Kirtan", duration: 1200 },
      { id: "3-2", type: "timer", label: "Meditation", duration: 1200 },
      { id: "3-3", type: "timer", label: "Kirtan", duration: 1200 },
      { id: "3-4", type: "timer", label: "Meditation", duration: 1200 },
      { id: "3-5", type: "timer", label: "Kirtan", duration: 1200 },
      { id: "3-6", type: "timer", label: "Meditation", duration: 1200 },
    ],
    duration_total: 7200,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];
