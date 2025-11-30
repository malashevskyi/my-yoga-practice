import { useState } from "react";
import { Drawer, IconButton, Box, Tabs, Tab, Typography } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { HistoryList } from "../../history/HistoryList";

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
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const toggleDrawer = () => {
    setOpen(!open);
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
      <Drawer anchor="right" open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 400, height: "100%" }}>
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
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="History" />
              <Tab label="Presets" disabled />
            </Tabs>
          </Box>

          {/* History Tab */}
          <TabPanel value={tabValue} index={0}>
            <HistoryList />
          </TabPanel>

          {/* Presets Tab (placeholder) */}
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body2" color="text.secondary" align="center">
              Presets coming soon...
            </Typography>
          </TabPanel>
        </Box>
      </Drawer>
    </>
  );
}
