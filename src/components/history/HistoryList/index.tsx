import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from "@mui/material";
import { useHistoryStore } from "../../../store/historyStore";
import { formatTime } from "../../../utils/time";

export function HistoryList() {
  const sessions = useHistoryStore((state) => state.sessions);
  const clearHistory = useHistoryStore((state) => state.clearHistory);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1" fontWeight={600}>
          Completed Timers
        </Typography>
        {sessions.length > 0 && (
          <Button
            size="small"
            color="error"
            onClick={clearHistory}
            sx={{ textTransform: "none" }}
          >
            Clear All
          </Button>
        )}
      </Box>

      {sessions.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No completed timers yet.
          <br />
          Start a timer to see your history here.
        </Typography>
      ) : (
        <List>
          {sessions
            .slice()
            .reverse()
            .map((session) => (
              <Box key={session.id} sx={{ mb: 5 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ px: 2 }}
                >
                  Session: {formatDate(session.startedAt)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                {session.completedTimers.length === 0 ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ px: 2, py: 1 }}
                  >
                    No timers completed in this session.
                  </Typography>
                ) : (
                  session.completedTimers.map((timer) => (
                    <ListItem key={timer.id}>
                      <ListItemText
                        primary={timer.step.label}
                        secondary={`${formatTime(
                          timer.step.duration,
                        )} • ${formatDate(timer.completedAt)}`}
                        primaryTypographyProps={{
                          fontWeight: 500,
                        }}
                      />
                    </ListItem>
                  ))
                )}
              </Box>
            ))}
        </List>
      )}
    </>
  );
}
