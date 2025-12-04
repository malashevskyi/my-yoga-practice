export interface User {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
}

export interface UserSettings {
  user: string;
  trackingProjectName: string | null;
  clockifyApiKey: string | null;
  clockifyWorkspaceId: string | null;
}
