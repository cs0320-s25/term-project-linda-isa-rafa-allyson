import { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Slider,
  AppBar,
  Toolbar,
  Button,
  Paper,
} from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HomeIcon from "@mui/icons-material/Home";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Link } from "react-router-dom";

interface Track {
  id: string;
  name: string;
  artist: string;
  preview_url: string;
  image_url: string;
  isFavorite: boolean;
}

export default function Favorites() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const loadFavorites = () => {
      setIsLoading(true);
      try {
        const userId = user?.id;
        if (!userId) return;

        const storedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  // Function to remove a track from favorites
  const removeFavorite = (trackId: string) => {
    const updatedFavorites = favorites.filter(track => track.id !== trackId);
    setFavorites(updatedFavorites);
    
    // Update localStorage
    const userId = user?.id;
    if (userId) {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    }

    // If the current playing track is removed, stop playback
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  // Play/Pause functionality (same as in PlaylistGenerator)
  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.volume = volume;
        audioRef.current.play();
      }
    }
  };

  // Volume control (same as in PlaylistGenerator)
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<HomeIcon />}
          >
            Home
          </Button>
          
          <Typography variant="h6" component="div" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            My Favorites
          </Typography>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/generate" 
            startIcon={<PlaylistAddIcon />}
          >
            Generate
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Favorite Tracks
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Typography>Loading your favorites...</Typography>
            </Box>
          ) : favorites.length === 0 ? (
            <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
              <MusicNoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                No favorites yet
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Head over to the playlist generator to discover and favorite some songs!
              </Typography>
              <Button 
                variant="contained" 
                component={Link} 
                to="/generate" 
                startIcon={<PlaylistAddIcon />}
                sx={{ mt: 2 }}
              >
                Generate Playlist
              </Button>
            </Paper>
          ) : (
            <Box sx={{ mt: 4 }}>
              <Typography variant="body1" color="text.secondary" paragraph>
                {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'} in your collection
              </Typography>
              
              <Grid container spacing={3}>
                {favorites.map((track) => (
                  <Grid item xs={12} sm={6} md={4} key={track.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={track.image_url}
                          alt={track.name}
                          sx={{ objectFit: "cover" }}
                        />
                        {/* Favorite Remove Button */}
                        <IconButton
                          onClick={() => removeFavorite(track.id)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                            color: "#ff1744",
                          }}
                        >
                          <FavoriteIcon />
                        </IconButton>
                      </Box>
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
    </>
  );
}