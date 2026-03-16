import { Toaster } from "react-hot-toast";
import { theme } from "../theme";

const ToastProvider = () => (
  <Toaster
    position="top-right"
    toastOptions={{
      success: {
        style: { background: theme.colors.accentLight, color: theme.colors.text, border: `1px solid ${theme.colors.accent}` },
      },
      error: {
        style: { background: "#FEE2E2", color: theme.colors.text, border: `1px solid ${theme.colors.error}` },
      },
    }}
  />
);

export default ToastProvider;
