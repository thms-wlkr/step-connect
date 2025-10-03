import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import "./index.css";

// Capacitor imports for iOS
import { StatusBar, Style } from '@capacitor/status-bar';
import { Keyboard } from '@capacitor/keyboard';
import { App as CapApp } from '@capacitor/app';

const queryClient = new QueryClient();

// Initialize Capacitor plugins for iOS
const initializeApp = async () => {
  // Set status bar style for iOS
  try {
    await StatusBar.setStyle({ style: Style.Light });
  } catch (e) {
    // Web fallback - status bar not available
  }

  // Handle keyboard on iOS
  try {
    Keyboard.setAccessoryBarVisible({ isVisible: true });
  } catch (e) {
    // Web fallback
  }

  // Handle app state changes
  CapApp.addListener('appStateChange', ({ isActive }) => {
    console.log('App state changed. Is active?', isActive);
  });
};

initializeApp();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
