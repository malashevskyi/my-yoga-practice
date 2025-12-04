import { useState } from "react";
import { Drawer, IconButton, Box, Tabs, Tab, Typography } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { HistoryList } from "../../history/HistoryList";
import { PresetsList } from "../../presets/PresetsList";
import { VideosList } from "../../videos/VideosList";
import { useDrawerStore } from "../../../store/drawerStore";
import { useAuthStore } from "../../../store/authStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`drawer-tabpanel-${index}`}
      aria-labelledby={`drawer-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function AppDrawer() {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const user = useAuthStore((state) => state.user);

  const isOpen = useDrawerStore((state) => state.isAppDrawerOpen);
  const setIsOpen = useDrawerStore((state) => state.setAppDrawerOpen);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton
        onClick={toggleDrawer}
        size="large"
        sx={{
          bgcolor: "action.hover",
          "&:hover": {
            bgcolor: "action.selected",
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <Box sx={{ maxWidth: 400, width: "100vw", height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">{t("menu.title")}</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label={t("menu.presets")} />
              <Tab label={t("menu.videos")} />
              <Tab label={t("menu.history")} />
            </Tabs>
          </Box>
          {user && (
            <>
              {/* Presets Tab */}
              <TabPanel value={tabValue} index={0}>
                <PresetsList />
              </TabPanel>

              {/* Videos Tab */}
              <TabPanel value={tabValue} index={1}>
                <VideosList />
              </TabPanel>

              {/* History Tab */}
              <TabPanel value={tabValue} index={2}>
                <HistoryList />
              </TabPanel>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
}
