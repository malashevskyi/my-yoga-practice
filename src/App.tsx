import { Box, Container } from "@mui/material";
import { ThemeDemo } from "./components/core/ThemeDemo/index.tsx";
import { TimerDebug } from "./components/debug/TimerDebug";

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
