import { useEffect } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // Set the page title for screen readers
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <Container maxWidth="md">
      <Box
        role="main"
        aria-label="Home page"
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: 4,
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom id="home-heading">
          Welcome to MoodTunes
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Generate personalized playlists based on your emotions and memories
        </Typography>
        {isSignedIn ? (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/generate")}
            aria-label="Generate Playlist"
          >
            Generate Playlist
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signin")}
            aria-label="Sign in to get started"
          >
            Sign In to Get Started
          </Button>
        )}
      </Box>
    </Container>
  );
}
