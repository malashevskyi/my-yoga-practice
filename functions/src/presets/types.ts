export interface PresetStep {
  duration: number;
  name: string;
}

export interface Preset {
  id: string;
  user: string;
  name: string;
  description: string | null;
  steps: PresetStep[];
  duration_total: number;
  created_at: string;
}
