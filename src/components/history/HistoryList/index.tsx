import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useClockifyHistory } from "../../../hooks/useClockifyHistory";
import { formatTime } from "../../../utils/formatTime";
import { useDrawerStore } from "../../../store/drawerStore";

export function HistoryList() {
  const { t } = useTranslation();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useClockifyHistory();
  const setSettingsDrawerOpen = useDrawerStore(
    (state) => state.setSettingsDrawerOpen,
  );

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
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

  const handleOpenSettings = () => {
    setSettingsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 4,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error" align="center">
        {t("history.loadError")}
      </Typography>
    );
  }

  // Check first page for configuration status
  const firstPage = data?.pages[0];
  if (firstPage?.needsConfiguration) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t("history.needsConfiguration")}
        </Typography>
        <Button variant="outlined" onClick={handleOpenSettings} sx={{ mt: 2 }}>
          {t("history.openSettings")}
        </Button>
      </Box>
    );
  }

  // Flatten all pages into single history array
  const allHistory = data?.pages.flatMap((page) => page.history) || [];

  return (
    <>
      {allHistory.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          {t("history.noTimers")}
          <br />
          {t("history.startTimer")}
        </Typography>
      ) : (
        <>
          <List>
            {allHistory.map((entry) => (
              <ListItem key={entry.id}>
                <ListItemText
                  primary={entry.label}
                  secondary={`${formatTime(entry.duration)} • ${formatDate(
                    entry.completedAt,
                  )}`}
                  primaryTypographyProps={{
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>

          {hasNextPage && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <Button
                variant="outlined"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? t("history.loading")
                  : t("history.loadMore")}
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
}
