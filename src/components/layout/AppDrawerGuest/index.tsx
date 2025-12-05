import { Drawer, IconButton, Box, Typography } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { useDrawerStore } from "../../../store/drawerStore";
import { LoginButton } from "../../core/LoginButton";

export function AppDrawerGuest() {
  const { t } = useTranslation();

  const isOpen = useDrawerStore((state) => state.isAppDrawerOpen);
  const setIsOpen = useDrawerStore((state) => state.setAppDrawerOpen);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Menu Button */}
      <IconButton onClick={toggleDrawer} size="large">
        <MenuIcon />
      </IconButton>

      {/* Drawer */}
      <Drawer anchor="right" open={isOpen} onClose={toggleDrawer}>
        <Box
          sx={{
            maxWidth: 400,
            width: "100vw",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
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

          {/* Login Prompt */}
          <Box
            sx={{
              p: 3,
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
              {t("guest.loginPromptTitle")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {t("guest.loginPromptFeatures")}:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2.5, mb: 2 }}>
              <Typography component="li" variant="body2" color="text.secondary">
                {t("guest.featureCreatePresets")}
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                {t("guest.featureAddVideos")}
              </Typography>
              <Typography component="li" variant="body2" color="text.secondary">
                {t("guest.featureHistory")}
              </Typography>
            </Box>
            <LoginButton variant="contained" fullWidth />
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
