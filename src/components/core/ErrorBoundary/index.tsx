import { Box } from "@mui/material";
import React from "react";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error in React component tree", error, errorInfo);
    toast.error(
      "An unexpected error occurred. Please try refreshing the page.",
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            right: 0,
            height: "100%",
            width: 350,
            background: "#ffebee",
            borderLeft: "1px solid #f44336",
            padding: 16,
            zIndex: 2147483647,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box width="100%">
            Something went wrong. Please try refreshing the page.
          </Box>
        </Box>
      );
    }
    return this.props.children;
  }
}
