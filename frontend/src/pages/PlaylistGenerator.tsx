import { useState, useRef, useEffect } from "react";
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
  AppBar,
  Toolbar,
} from "@mui/material";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HomeIcon from "@mui/icons-material/Home";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { Link } from "react-router-dom";
import { useVoiceOver } from "../services/voice-over";
interface Track {
  id: string;
  name: string;
  artist: string;
  preview_url: string;
  image_url: string;
  isFavorite?: boolean;
  isDisliked?: boolean;
  isLoading?: boolean;
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
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [disliked, setDisliked] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { getToken } = useAuth();
  const { user } = useUser();
  const voiceOver = useVoiceOver();
  // Load favorites and disliked songs from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const userId = user?.id;
        if (!userId) return;
        // Load favorites
        const storedFavorites = localStorage.getItem(`favorites_${userId}`);
        if (storedFavorites) {
          const favoritesData = JSON.parse(storedFavorites);
          setFavorites(favoritesData);
        }
        
        // Load disliked songs
        const storedDisliked = localStorage.getItem(`disliked_${userId}`);
        if (storedDisliked) {
          const dislikedData = JSON.parse(storedDisliked);
          setDisliked(dislikedData);
        }
        
        // Mark tracks that are favorites or disliked
        if (tracks.length > 0) {
          const updatedTracks = tracks.map(track => ({
            ...track,
            isFavorite: favorites.some((fav: Track) => fav.id === track.id),
            isDisliked: disliked.some((dis: Track) => dis.id === track.id)
          }));
          setTracks(updatedTracks);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, [user, tracks.length]);
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
        { 
          emotion, 
          memory,
          dislikedSongs: disliked.map((track) => ({
            title: track.name,
            artist: track.artist,
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Check if any of the returned tracks are in favorites or disliked
      const tracksWithStatus = response.data.tracks.map((track: Track) => ({
        ...track,
        isFavorite: favorites.some(fav => fav.id === track.id),
        isDisliked: disliked.some(dis => dis.id === track.id)
      }));
      
      setTracks(tracksWithStatus);
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
          dislikedSongs: disliked.map((track) => ({
            title: track.name,
            artist: track.artist,
          }))
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Check if any of the returned tracks are in favorites or disliked
      const tracksWithStatus = response.data.tracks.map((track: Track) => ({
        ...track,
        isFavorite: favorites.some(fav => fav.id === track.id),
        isDisliked: disliked.some(dis => dis.id === track.id)
      }));
      
      setTracks(tracksWithStatus);
    } catch (err) {
      setError("Failed to regenerate playlist. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handlePlayPause = (track: Track) => {
    console.log("Play/Pause clicked for track:", track.name);
    
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
  const handleVolumeChange = (_event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  // Toggle favorite status
  const toggleFavorite = (track: Track) => {
    // Update the track in the current list
    const updatedTracks = tracks.map(t => 
      t.id === track.id ? { ...t, isFavorite: !t.isFavorite } : t
    );
    setTracks(updatedTracks);
    
    // Update favorites list
    let updatedFavorites;
    
    if (track.isFavorite) {
      // Remove from favorites
      updatedFavorites = favorites.filter(t => t.id !== track.id);
    } else {
      // Add to favorites
      updatedFavorites = [...favorites, { ...track, isFavorite: true }];
    }
    
    setFavorites(updatedFavorites);
    
    // Save to localStorage
    const userId = user?.id;
    if (userId) {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
    }
  };
  // Add track to disliked list and fetch a replacement
  const dislikeTrack = async (track: Track) => {
    // Set loading state for this specific track
    const updatedTracksLoading = tracks.map(t => 
      t.id === track.id ? { ...t, isDisliked: true, isLoading: true } : t
    );
    setTracks(updatedTracksLoading);
    
    // Add to disliked list if not already there
    if (!disliked.some(t => t.id === track.id)) {
      const updatedDisliked = [...disliked, { ...track, isDisliked: true }];
      setDisliked(updatedDisliked);
      
      // Save to localStorage
      const userId = user?.id;
      if (userId) {
        localStorage.setItem(`disliked_${userId}`, JSON.stringify(updatedDisliked));
      }
    }
    
    // Fetch a replacement song
    try {
      const token = await getToken();
      const response = await axios.post(
        "/api/playlists/generate",
        {
          emotion,
          memory,
          count: 1, // Only request 1 replacement song
          excludeSongs: [
            ...tracks.map((t) => ({
              title: t.name,
              artist: t.artist,
            })),
            ...disliked.map((t) => ({
              title: t.name,
              artist: t.artist,
            }))
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data.tracks && response.data.tracks.length > 0) {
        const replacementTrack = response.data.tracks[0];
        
        // Check if replacement is in favorites
        replacementTrack.isFavorite = favorites.some(fav => fav.id === replacementTrack.id);
        
        // Replace the disliked track with the new one
        const finalUpdatedTracks = tracks.map(t => 
          t.id === track.id ? replacementTrack : t
        );
        setTracks(finalUpdatedTracks);
      } else {
        // If no replacement found, just remove the disliked track
        const filteredTracks = tracks.filter(t => t.id !== track.id);
        setTracks(filteredTracks);
      }
    } catch (error) {
      console.error("Error fetching replacement track:", error);
      
      // Remove loading state but keep disliked state
      const updatedTracksError = tracks.map(t => 
        t.id === track.id ? { ...t, isDisliked: true, isLoading: false } : t
      );
      setTracks(updatedTracksError);
    }
  };
  // Add voice-over for buttons and text
  const handleButtonHover = (text: string) => {
    voiceOver.speak(text);
  };
  const handleTrackHover = (track: Track) => {
    voiceOver.speak(`${track.name} by ${track.artist}`);
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
            onMouseEnter={() => handleButtonHover("Home button")}
          >
            Home
          </Button>
          
          <Typography 
            variant="h6"
            component="div"
            sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
            aria-label="Generate Your Playlist"
            onMouseEnter={() => handleButtonHover("Generate Your Playlist")}
          >
            Generate Your Playlist
          </Typography>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/favorites" 
            startIcon={<BookmarkIcon />}
            onMouseEnter={() => handleButtonHover("Favorites button")}
          >
            Favorites
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            onMouseEnter={() => handleButtonHover("Generate Your Playlist")}
          >
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
                  onMouseEnter={() => handleButtonHover("How are you feeling?")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Share a memory related to your emotion."
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  multiline
                  rows={4}
                  placeholder="e.g., Walking through the park on a sunny autumn day"
                  onMouseEnter={() => handleButtonHover("Share a memory related to your emotion")}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  fullWidth
                  onMouseEnter={() => handleButtonHover(loading ? "Loading" : "Generate Playlist")}
                >
                  {loading ? <CircularProgress size={24} /> : "Generate Playlist"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && (
            <Typography 
              color="error" 
              sx={{ mt: 2 }}
              onMouseEnter={() => handleButtonHover(error)}
            >
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
                <Typography 
                  variant="h5"
                  onMouseEnter={() => handleButtonHover("Your Generated Playlist")}
                >
                  Your Generated Playlist
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleRegenerate}
                  disabled={loading}
                  onMouseEnter={() => handleButtonHover("Regenerate playlist")}
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
                        position: "relative",
                      }}
                      onMouseEnter={() => handleTrackHover(track)}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={track.image_url}
                          alt={track.name}
                          sx={{ 
                            objectFit: "cover",
                            opacity: track.isLoading ? 0.5 : 1
                          }}
                        />
                        {track.isLoading && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                            }}
                          >
                            <CircularProgress sx={{ color: "white" }} />
                          </Box>
                        )}
                        {/* Favorite Icon Button */}
                        <IconButton
                          onClick={() => toggleFavorite(track)}
                          disabled={track.isLoading}
                          sx={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                            color: track.isFavorite ? "#ff1744" : "white",
                          }}
                          onMouseEnter={() => handleButtonHover(track.isFavorite ? "Remove from favorites" : "Add to favorites")}
                        >
                          {track.isFavorite ? (
                            <FavoriteIcon />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        
                        {/* Dislike Icon Button */}
                        <IconButton
                          onClick={() => dislikeTrack(track)}
                          disabled={track.isDisliked || track.isLoading}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            },
                            color: track.isDisliked ? "gray" : "white",
                          }}
                          onMouseEnter={() => handleButtonHover(track.isDisliked ? "Song disliked" : "Dislike this song")}
                        >
                          <ThumbDownIcon />
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
