import { Box, Container } from "@mui/material";
import { ThemeDemo } from "./components/ThemeDemo";
import { TimerDebug } from "./components/TimerDebug";

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Theme & Language Controls */}
        <ThemeDemo />

        {/* Timer Debug Dashboard */}
        <Box sx={{ mt: 4 }}>
          <TimerDebug />
        </Box>
      </Box>
    </Container>
  );
}

export default App;
