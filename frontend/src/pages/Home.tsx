import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function Home() {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  return (
    <Container maxWidth="md">
      <Box
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
        <Typography variant="h2" component="h1" gutterBottom>
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
          >
            Generate Playlist
          </Button>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/signin")}
          >
            Sign In to Get Started
          </Button>
        )}
      </Box>
    </Container>
  );
}
