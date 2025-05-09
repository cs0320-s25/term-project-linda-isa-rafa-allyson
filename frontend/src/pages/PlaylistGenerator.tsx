import { useState, useRef } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  IconButton,
  Slider,
} from "@mui/material";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RefreshIcon from "@mui/icons-material/Refresh";

interface Track {
  id: string;
  name: string;
  artist: string;
  preview_url: string;
  image_url: string;
}

export default function PlaylistGenerator() {
  const [emotion, setEmotion] = useState("");
  const [memory, setMemory] = useState("");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTracks([]);
    setCurrentTrack(null);
    setIsPlaying(false);

    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/playlists/generate",
        { emotion, memory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTracks(response.data.tracks);
    } catch (err) {
      setError("Failed to generate playlist. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setError("");
    setCurrentTrack(null);
    setIsPlaying(false);

    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/playlists/generate",
        {
          emotion,
          memory,
          excludeSongs: tracks.map((track) => ({
            title: track.name,
            artist: track.artist,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTracks(response.data.tracks);
    } catch (err) {
      setError("Failed to regenerate playlist. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = (track: Track) => {
    console.log("Play/Pause clicked for track:", track.name);
    console.log("Current track:", currentTrack?.id);
    console.log("Is playing:", isPlaying);

    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      if (audioRef.current) {
        if (isPlaying) {
          console.log("Pausing track");
          audioRef.current.pause();
        } else {
          console.log("Playing track");
          audioRef.current.play();
        }
      }
    } else {
      console.log("Switching to new track");
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.volume = volume;
        audioRef.current.play();
      }
    }
  };

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Your Playlist
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="How are you feeling?"
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                required
                placeholder="e.g., nostalgic, joyful, bittersweet"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Share a memory"
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                multiline
                rows={4}
                placeholder="e.g., Walking through the park on a sunny autumn day"
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Generate Playlist"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {tracks.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h5">Your Generated Playlist</Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRegenerate}
                disabled={loading}
                sx={{
                  color: "#1DB954",
                  borderColor: "#1DB954",
                  "&:hover": { borderColor: "#1DB954" },
                }}
              >
                Regenerate
              </Button>
            </Box>
            <Grid container spacing={3}>
              {tracks.map((track) => (
                <Grid item xs={12} sm={6} md={4} key={track.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={track.image_url}
                      alt={track.name}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography
                        gutterBottom
                        variant="h6"
                        component="div"
                        noWrap
                      >
                        {track.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {track.artist}
                      </Typography>
                      {track.preview_url && (
                        <Box sx={{ mt: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              backgroundColor: "#f5f5f5",
                              padding: 1,
                              borderRadius: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => handlePlayPause(track)}
                              sx={{
                                color: "#1DB954",
                                backgroundColor: "white",
                                border: "2px solid #1DB954",
                                width: 40,
                                height: 40,
                                "&:hover": {
                                  backgroundColor: "#f0f0f0",
                                },
                              }}
                            >
                              {currentTrack?.id === track.id && isPlaying ? (
                                <PauseIcon fontSize="large" />
                              ) : (
                                <PlayArrowIcon fontSize="large" />
                              )}
                            </IconButton>
                            <Box sx={{ flexGrow: 1 }}>
                              <Slider
                                size="small"
                                defaultValue={0}
                                max={30}
                                disabled
                                sx={{
                                  color: "#1DB954",
                                  "& .MuiSlider-thumb": {
                                    display: "none",
                                  },
                                }}
                              />
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: 100,
                              }}
                            >
                              <VolumeUpIcon sx={{ mr: 1, color: "#1DB954" }} />
                              <Slider
                                size="small"
                                value={volume}
                                onChange={handleVolumeChange}
                                min={0}
                                max={1}
                                step={0.1}
                                sx={{ color: "#1DB954" }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <audio ref={audioRef} />
          </Box>
        )}
      </Box>
    </Container>
  );
}
