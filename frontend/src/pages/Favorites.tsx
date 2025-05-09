// import { useState, useEffect, useRef } from "react";
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   IconButton,
//   Slider,
//   AppBar,
//   Toolbar,
//   Button,
//   Paper,
// } from "@mui/material";
// import { useUser } from "@clerk/clerk-react";
// import PlayArrowIcon from "@mui/icons-material/PlayArrow";
// import PauseIcon from "@mui/icons-material/Pause";
// import VolumeUpIcon from "@mui/icons-material/VolumeUp";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import HomeIcon from "@mui/icons-material/Home";
// import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
// import MusicNoteIcon from "@mui/icons-material/MusicNote";
// import { Link } from "react-router-dom";

// interface Track {
//   id: string;
//   name: string;
//   artist: string;
//   preview_url: string;
//   image_url: string;
//   isFavorite: boolean;
// }

// export default function Favorites() {
//   const { user } = useUser();
//   const [favorites, setFavorites] = useState<Track[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [volume, setVolume] = useState(0.7);
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   // Load favorites from localStorage on component mount
//   useEffect(() => {
//     const loadFavorites = () => {
//       setIsLoading(true);
//       try {
//         const userId = user?.id;
//         if (!userId) return;

//         const storedFavorites = localStorage.getItem(`favorites_${userId}`);
//         if (storedFavorites) {
//           setFavorites(JSON.parse(storedFavorites));
//         }
//       } catch (error) {
//         console.error('Error loading favorites:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadFavorites();
//   }, [user]);

//   // Function to remove a track from favorites
//   const removeFavorite = (trackId: string) => {
//     const updatedFavorites = favorites.filter(track => track.id !== trackId);
//     setFavorites(updatedFavorites);
    
//     // Update localStorage
//     const userId = user?.id;
//     if (userId) {
//       localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
//     }

//     // If the current playing track is removed, stop playback
//     if (currentTrack?.id === trackId) {
//       setCurrentTrack(null);
//       setIsPlaying(false);
//       if (audioRef.current) {
//         audioRef.current.pause();
//       }
//     }
//   };

//   // Play/Pause functionality (same as in PlaylistGenerator)
//   const handlePlayPause = (track: Track) => {
//     if (currentTrack?.id === track.id) {
//       setIsPlaying(!isPlaying);
//       if (audioRef.current) {
//         if (isPlaying) {
//           audioRef.current.pause();
//         } else {
//           audioRef.current.play();
//         }
//       }
//     } else {
//       setCurrentTrack(track);
//       setIsPlaying(true);
//       if (audioRef.current) {
//         audioRef.current.src = track.preview_url;
//         audioRef.current.volume = volume;
//         audioRef.current.play();
//       }
//     }
//   };

//   // Volume control (same as in PlaylistGenerator)
//   const handleVolumeChange = (event: Event, newValue: number | number[]) => {
//     const newVolume = newValue as number;
//     setVolume(newVolume);
//     if (audioRef.current) {
//       audioRef.current.volume = newVolume;
//     }
//   };

//   return (
//     <>
//       <AppBar position="static" color="primary" sx={{ mb: 4 }}>
//         <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
//           <Button 
//             color="inherit" 
//             component={Link} 
//             to="/" 
//             startIcon={<HomeIcon />}
//           >
//             Home
//           </Button>
          
//           <Typography variant="h6" component="div" sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//             My Favorites
//           </Typography>
          
//           <Button 
//             color="inherit" 
//             component={Link} 
//             to="/generate" 
//             startIcon={<PlaylistAddIcon />}
//           >
//             Generate
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="md">
//         <Box sx={{ py: 4 }}>
//           <Typography variant="h4" component="h1" gutterBottom>
//             Your Favorite Tracks
//           </Typography>

//           {isLoading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//               <Typography>Loading your favorites...</Typography>
//             </Box>
//           ) : favorites.length === 0 ? (
//             <Paper sx={{ p: 4, mt: 4, textAlign: 'center' }}>
//               <MusicNoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
//               <Typography variant="h5" gutterBottom>
//                 No favorites yet
//               </Typography>
//               <Typography variant="body1" color="text.secondary" paragraph>
//                 Head over to the playlist generator to discover and favorite some songs!
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 component={Link} 
//                 to="/generate" 
//                 startIcon={<PlaylistAddIcon />}
//                 sx={{ mt: 2 }}
//               >
//                 Generate Playlist
//               </Button>
//             </Paper>
//           ) : (
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="body1" color="text.secondary" paragraph>
//                 {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'} in your collection
//               </Typography>
              
//               <Grid container spacing={3}>
//                 {favorites.map((track) => (
//                   <Grid item xs={12} sm={6} md={4} key={track.id}>
//                     <Card
//                       sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         position: "relative",
//                       }}
//                     >
//                       <Box sx={{ position: "relative" }}>
//                         <CardMedia
//                           component="img"
//                           height="200"
//                           image={track.image_url}
//                           alt={track.name}
//                           sx={{ objectFit: "cover" }}
//                         />
//                         {/* Favorite Remove Button */}
//                         <IconButton
//                           onClick={() => removeFavorite(track.id)}
//                           sx={{
//                             position: "absolute",
//                             top: 8,
//                             left: 8,
//                             backgroundColor: "rgba(0, 0, 0, 0.5)",
//                             "&:hover": {
//                               backgroundColor: "rgba(0, 0, 0, 0.7)",
//                             },
//                             color: "#ff1744",
//                           }}
//                         >
//                           <FavoriteIcon />
//                         </IconButton>
//                       </Box>
//                       <CardContent sx={{ flexGrow: 1 }}>
//                         <Typography
//                           gutterBottom
//                           variant="h6"
//                           component="div"
//                           noWrap
//                         >
//                           {track.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary" noWrap>
//                           {track.artist}
//                         </Typography>
//                         {track.preview_url && (
//                           <Box sx={{ mt: 2 }}>
//                             <Box
//                               sx={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 gap: 1,
//                                 backgroundColor: "#f5f5f5",
//                                 padding: 1,
//                                 borderRadius: 1,
//                               }}
//                             >
//                               <IconButton
//                                 onClick={() => handlePlayPause(track)}
//                                 sx={{
//                                   color: "#1DB954",
//                                   backgroundColor: "white",
//                                   border: "2px solid #1DB954",
//                                   width: 40,
//                                   height: 40,
//                                   "&:hover": {
//                                     backgroundColor: "#f0f0f0",
//                                   },
//                                 }}
//                               >
//                                 {currentTrack?.id === track.id && isPlaying ? (
//                                   <PauseIcon fontSize="large" />
//                                 ) : (
//                                   <PlayArrowIcon fontSize="large" />
//                                 )}
//                               </IconButton>
//                               <Box sx={{ flexGrow: 1 }}>
//                                 <Slider
//                                   size="small"
//                                   defaultValue={0}
//                                   max={30}
//                                   disabled
//                                   sx={{
//                                     color: "#1DB954",
//                                     "& .MuiSlider-thumb": {
//                                       display: "none",
//                                     },
//                                   }}
//                                 />
//                               </Box>
//                               <Box
//                                 sx={{
//                                   display: "flex",
//                                   alignItems: "center",
//                                   width: 100,
//                                 }}
//                               >
//                                 <VolumeUpIcon sx={{ mr: 1, color: "#1DB954" }} />
//                                 <Slider
//                                   size="small"
//                                   value={volume}
//                                   onChange={handleVolumeChange}
//                                   min={0}
//                                   max={1}
//                                   step={0.1}
//                                   sx={{ color: "#1DB954" }}
//                                 />
//                               </Box>
//                             </Box>
//                           </Box>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//               <audio ref={audioRef} />
//             </Box>
//           )}
//         </Box>
//       </Container>
//     </>
//   );
// }

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
  const removeFavorite = (trackId: string, trackName: string) => {
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
    
    // Announce to screen readers that track was removed
    const announcement = document.getElementById('screen-reader-announcement');
    if (announcement) {
      announcement.textContent = `${trackName} removed from favorites`;
    }
  };

  // Play/Pause functionality
  const handlePlayPause = (track: Track) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          // Announce to screen readers
          const announcement = document.getElementById('screen-reader-announcement');
          if (announcement) {
            announcement.textContent = `Paused ${track.name}`;
          }
        } else {
          audioRef.current.play();
          // Announce to screen readers
          const announcement = document.getElementById('screen-reader-announcement');
          if (announcement) {
            announcement.textContent = `Playing ${track.name}`;
          }
        }
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.preview_url;
        audioRef.current.volume = volume;
        audioRef.current.play();
        // Announce to screen readers
        const announcement = document.getElementById('screen-reader-announcement');
        if (announcement) {
          announcement.textContent = `Playing ${track.name} by ${track.artist}`;
        }
      }
    }
  };

  // Volume control
  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const newVolume = newValue as number;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    // Announce volume change to screen readers
    const announcement = document.getElementById('screen-reader-announcement');
    if (announcement) {
      const volumePercent = Math.round(newVolume * 100);
      announcement.textContent = `Volume set to ${volumePercent} percent`;
    }
  };

  return (
    <>
      {/* Skip to main content link for keyboard navigation */}
      <a 
        href="#main-content" 
        className="skip-link"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: 'auto', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}
        tabIndex={0}
      >
        Skip to main content
      </a>
      
      {/* Screen reader announcement area */}
      <div 
        id="screen-reader-announcement" 
        aria-live="polite" 
        className="sr-only"
        style={{ 
          position: 'absolute', 
          width: '1px', 
          height: '1px', 
          padding: '0', 
          margin: '-1px', 
          overflow: 'hidden', 
          clip: 'rect(0, 0, 0, 0)', 
          whiteSpace: 'nowrap', 
          borderWidth: '0' 
        }}
      ></div>
      
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar 
          sx={{ display: 'flex', justifyContent: 'space-between' }}
          role="navigation"
          aria-label="Main navigation"
        >
          <Button 
            color="inherit" 
            component={Link} 
            to="/" 
            startIcon={<HomeIcon />}
            aria-label="Go to home page"
          >
            Home
          </Button>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
          >
            My Favorites
          </Typography>
          
          <Button 
            color="inherit" 
            component={Link} 
            to="/generate" 
            startIcon={<PlaylistAddIcon />}
            aria-label="Go to playlist generator"
          >
            Generate
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box 
          sx={{ py: 4 }}
          id="main-content"
          tabIndex={-1}
          component="main"
          role="main"
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Your Favorite Tracks
          </Typography>

          {isLoading ? (
            <Box 
              sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
              role="status"
              aria-live="polite"
            >
              <Typography>Loading your favorites...</Typography>
            </Box>
          ) : favorites.length === 0 ? (
            <Paper 
              sx={{ p: 4, mt: 4, textAlign: 'center' }}
              aria-label="No favorites message"
            >
              <MusicNoteIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} aria-hidden="true" />
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
                aria-label="Go to playlist generator to find songs"
              >
                Generate Playlist
              </Button>
            </Paper>
          ) : (
            <Box sx={{ mt: 4 }}>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                paragraph
                aria-live="polite"
              >
                {favorites.length} {favorites.length === 1 ? 'track' : 'tracks'} in your collection
              </Typography>
              
              <Grid 
                container 
                spacing={3}
                role="list"
                aria-label="Favorite tracks"
              >
                {favorites.map((track) => (
                  <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={4} 
                    key={track.id}
                    role="listitem"
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                      }}
                      aria-label={`${track.name} by ${track.artist}`}
                    >
                      <Box sx={{ position: "relative" }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={track.image_url}
                          alt={`Album artwork for ${track.name} by ${track.artist}`}
                          sx={{ objectFit: "cover" }}
                        />
                        {/* Favorite Remove Button */}
                        <IconButton
                          onClick={() => removeFavorite(track.id, track.name)}
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
                          aria-label={`Remove ${track.name} from favorites`}
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
                          <Box 
                            sx={{ mt: 2 }}
                            role="region"
                            aria-label={`Audio controls for ${track.name}`}
                          >
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
                                aria-label={currentTrack?.id === track.id && isPlaying 
                                  ? `Pause ${track.name}` 
                                  : `Play ${track.name}`}
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
                                  aria-label="Track progress"
                                  aria-hidden="true" // Since this is decorative only
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  width: 100,
                                }}
                                role="group"
                                aria-label="Volume control"
                              >
                                <VolumeUpIcon sx={{ mr: 1, color: "#1DB954" }} aria-hidden="true" />
                                <Slider
                                  size="small"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  min={0}
                                  max={1}
                                  step={0.1}
                                  sx={{ color: "#1DB954" }}
                                  aria-label="Volume"
                                  aria-valuetext={`${Math.round(volume * 100)}%`}
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