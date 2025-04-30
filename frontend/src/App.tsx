import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from "@clerk/clerk-react";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import PlaylistGenerator from "./pages/PlaylistGenerator";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1DB954", // Spotify green
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

function App() {
  const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  console.log("Clerk key:", import.meta.env.VITE_CLERK_PUBLISHABLE_KEY);

  if (!clerkPubKey) {
    console.error("Missing Clerk publishable key");
    return <div>Error: Missing Clerk publishable key</div>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      appearance={{
        elements: {
          formButtonPrimary: {
            backgroundColor: "#1DB954",
            "&:hover": {
              backgroundColor: "#1ed760",
            },
          },
        },
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/signin/*"
              element={
                <SignIn
                  routing="path"
                  path="/signin"
                  appearance={{
                    elements: {
                      formButtonPrimary: {
                        backgroundColor: "#1DB954",
                        "&:hover": {
                          backgroundColor: "#1ed760",
                        },
                      },
                    },
                  }}
                />
              }
            />
            <Route
              path="/signup/*"
              element={
                <SignUp
                  routing="path"
                  path="/signup"
                  appearance={{
                    elements: {
                      formButtonPrimary: {
                        backgroundColor: "#1DB954",
                        "&:hover": {
                          backgroundColor: "#1ed760",
                        },
                      },
                    },
                  }}
                />
              }
            />
            <Route
              path="/generate"
              element={
                <>
                  <SignedIn>
                    <PlaylistGenerator />
                  </SignedIn>
                  <SignedOut>
                    <Navigate to="/signin" />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;
