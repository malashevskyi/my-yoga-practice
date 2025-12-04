const CLOCKIFY_BASE_URL = "https://api.clockify.me/api/v1";

interface ClockifyProject {
  id: string;
  name: string;
  workspaceId: string;
}

interface ClockifyTask {
  id: string;
  name: string;
  projectId: string;
}

export interface ClockifyTimeEntry {
  id: string;
  description: string;
  projectId: string;
  taskId: string | null;
  userId: string;
  workspaceId: string;
  timeInterval: {
    start: string;
    end: string;
    duration: string; // ISO 8601 duration format (PT7H2M43S)
  };
  billable: boolean;
  tagIds: string[];
  type: string;
  isLocked: boolean;
}

/**
 * Find project by name or create if doesn't exist
 */
export async function findOrCreateProject(
  apiKey: string,
  workspaceId: string,
  projectName: string,
): Promise<ClockifyProject> {
  const searchProjectResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/projects?name=${encodeURIComponent(
      projectName,
    )}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    },
  );

  if (!searchProjectResponse.ok) {
    throw new Error(
      `Failed to search projects: ${searchProjectResponse.statusText}`,
    );
  }

  const projects: ClockifyProject[] = await searchProjectResponse.json();
  const existingProject = projects.find(
    (p) => p.name.toLowerCase() === projectName.toLowerCase(),
  );

  if (existingProject) return existingProject;

  const createProjectResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/projects`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: projectName,
        isPublic: false,
      }),
    },
  );

  if (!createProjectResponse.ok) {
    throw new Error(
      `Failed to create project: ${createProjectResponse.statusText}`,
    );
  }

  return await createProjectResponse.json();
}

/**
 * Find task by name or create if doesn't exist
 */
export async function findOrCreateTask(
  apiKey: string,
  workspaceId: string,
  projectId: string,
  taskName: string,
): Promise<ClockifyTask> {
  const findTaskResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    },
  );

  if (!findTaskResponse.ok) {
    throw new Error(`Failed to get tasks: ${findTaskResponse.statusText}`);
  }

  const tasks: ClockifyTask[] = await findTaskResponse.json();

  /**
   * Assumes that two different tasks cannot have the same name with only different letter casing
   */
  const existingTask = tasks.find(
    (t) => t.name.toLowerCase() === taskName.toLowerCase(),
  );

  if (existingTask) return existingTask;

  const createTaskResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: taskName,
      }),
    },
  );

  if (!createTaskResponse.ok) {
    throw new Error(`Failed to create task: ${createTaskResponse.statusText}`);
  }

  return await createTaskResponse.json();
}

/**
 * Get task by ID
 */
export async function getTask(
  apiKey: string,
  workspaceId: string,
  projectId: string,
  taskId: string,
): Promise<ClockifyTask> {
  const getTaskResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    },
  );

  if (!getTaskResponse.ok) {
    throw new Error(`Failed to get task: ${getTaskResponse.statusText}`);
  }

  return await getTaskResponse.json();
}

/**
 * Create time entry
 */
export async function createTimeEntry(
  apiKey: string,
  workspaceId: string,
  projectId: string,
  taskId: string,
  description: string,
  startTime: Date,
  endTime: Date,
): Promise<ClockifyTimeEntry> {
  const createTimeEntryResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/time-entries`,
    {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        start: startTime.toISOString(),
        end: endTime.toISOString(),
        projectId,
        taskId,
        description,
      }),
    },
  );

  if (!createTimeEntryResponse.ok) {
    const errorText = await createTimeEntryResponse.text();
    throw new Error(`Failed to create time entry: ${errorText}`);
  }

  return await createTimeEntryResponse.json();
}

/**
 * Get time entries for user
 * Clockify API returns entries in descending order (newest first)
 */
export async function getTimeEntries(
  apiKey: string,
  workspaceId: string,
  userId: string,
  projectId?: string,
  startDate?: Date,
  endDate?: Date,
  pageSize = 100,
): Promise<ClockifyTimeEntry[]> {
  const params = new URLSearchParams();

  if (projectId) {
    params.append("project", projectId);
  }
  if (startDate) {
    params.append("start", startDate.toISOString());
  }
  if (endDate) {
    params.append("end", endDate.toISOString());
  }

  params.append("page-size", pageSize.toString());

  const getTimeEntriesResponse = await fetch(
    `${CLOCKIFY_BASE_URL}/workspaces/${workspaceId}/user/${userId}/time-entries?${params.toString()}`,
    {
      headers: {
        "X-Api-Key": apiKey,
      },
    },
  );

  if (!getTimeEntriesResponse.ok) {
    throw new Error(
      `Failed to get time entries: ${getTimeEntriesResponse.statusText}`,
    );
  }

  return await getTimeEntriesResponse.json();
}

/**
 * Get current user info
 */
export async function getCurrentUser(apiKey: string) {
  const getCurrentUserResponse = await fetch(`${CLOCKIFY_BASE_URL}/user`, {
    headers: {
      "X-Api-Key": apiKey,
    },
  });

  if (!getCurrentUserResponse.ok) {
    throw new Error(`Failed to get user: ${getCurrentUserResponse.statusText}`);
  }

  return await getCurrentUserResponse.json();
}
