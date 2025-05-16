import { Request, Response } from "express";
import SpotifyWebApi from "spotify-web-api-node";
import { OpenAI } from "openai";
import spotifyPreviewFinder from "spotify-preview-finder";
import dotenv from 'dotenv';
dotenv.config();
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const generatePlaylist = async (req: Request, res: Response) => {
  try {
    const { emotion, memory, excludeSongs, dislikedSongs, count } = req.body;
    console.log("Received request:", { emotion, memory, excludeSongs, dislikedSongs, count });
    if (!emotion) {
      return res.status(400).json({ error: "Emotion is required" });
    }
    if (!memory) {
      return res.status(400).json({ error: "Memory is required" });
    }
    // Get token for Spotify API
    try {
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body["access_token"]);
      console.log("Successfully obtained Spotify token");
    } catch (error) {
      console.error("Error getting Spotify token:", error);
      return res
        .status(500)
        .json({ error: "Failed to authenticate with Spotify" });
    }
    // Combine excluded and disliked songs for filtering
    const songsToExclude = [
      ...(excludeSongs || []),
      ...(dislikedSongs || [])
    ];
    // Determine how many songs to generate (default to 5, or use count parameter if provided)
    const numberOfSongs = count ? parseInt(count.toString()) : 5;
    // Use OpenAI to analyze emotion and memory
    try {
      console.log("Sending request to OpenAI...");
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a music expert with deep knowledge of both popular and obscure music across all genres and eras. 
            When suggesting songs based on emotions and memories, consider:
            1. The specific mood and emotional nuances
            2. The cultural and personal context of the memory
            3. A mix of well-known and lesser-known tracks
            4. Songs that have strong emotional resonance
            5. Tracks that might evoke similar memories in others
            6. Consider both lyrics and musical elements
            7. Include songs from different decades and genres
            8. Look for tracks that have a strong connection to the described emotion
            
            Return only a JSON array of EXACTLY ${numberOfSongs} song titles and artists in this format: 
            { songs: [{ title: 'song title', artist: 'artist name' }] }
            
            ${songsToExclude?.length
                ? `Please exclude these songs and suggest completely different ones:\n${songsToExclude
                    .map(
                      (song: { title: string; artist: string }) =>
                        `- ${song.title} by ${song.artist}`
                    )
                    .join("\n")}`
                : ""}`,
          },
          {
            role: "user",
            content: `Emotion: ${emotion}\nMemory: ${memory}\n\nPlease suggest exactly ${numberOfSongs} songs that capture this feeling and context. Consider both the emotional state and any specific details from the memory.`,
          },
        ],
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        temperature: 0.8,
      });
      console.log("OpenAI raw response:", completion);
      const openaiResponse = completion.choices[0].message.content;
      console.log("OpenAI response content:", openaiResponse);
      let suggestedSongs;
      try {
        suggestedSongs = JSON.parse(openaiResponse).songs;
        console.log("Parsed suggested songs:", suggestedSongs);
        // Ensure we have the correct number of songs
        if (!Array.isArray(suggestedSongs) || suggestedSongs.length !== numberOfSongs) {
          console.error(`Did not receive exactly ${numberOfSongs} songs`);
          return res
            .status(500)
            .json({ error: `Failed to generate exactly ${numberOfSongs} songs` });
        }
      } catch (parseError) {
        console.error("Error parsing OpenAI response:", parseError);
        return res
          .status(500)
          .json({ error: "Failed to parse song suggestions" });
      }
      // Search for songs and get preview URLs
      console.log("Searching for songs and getting preview URLs...");
      const tracks = await Promise.all(
        suggestedSongs.map(async (song: { title: string; artist: string }) => {
          try {
            console.log(`Searching for: ${song.title} by ${song.artist}`);
            // First, get the track details from Spotify API
            const spotifySearch = await spotifyApi.search(
              `${song.title} ${song.artist}`,
              ["track"],
              {
                limit: 1,
              }
            );
            const spotifyTrack = spotifySearch.body.tracks?.items[0];
            if (!spotifyTrack) {
              console.log(`No track found in Spotify API for ${song.title}`);
              return null;
            }
            // Then get the preview URL using spotify-preview-finder
            const previewResult = await spotifyPreviewFinder(
              `${song.title} ${song.artist}`,
              1
            );
            if (previewResult.success && previewResult.results.length > 0) {
              const previewTrack = previewResult.results[0];
              console.log(`Found track with preview: ${previewTrack.name}`);
              return {
                id: spotifyTrack.id,
                name: spotifyTrack.name,
                artist: spotifyTrack.artists[0].name,
                preview_url: previewTrack.previewUrls[0] || null,
                image_url: spotifyTrack.album.images[0]?.url || null,
              };
            }
            // If no preview URL found, still return the track with image
            console.log(
              `No preview URL found for ${song.title}, but keeping track with image`
            );
            return {
              id: spotifyTrack.id,
              name: spotifyTrack.name,
              artist: spotifyTrack.artists[0].name,
              preview_url: null,
              image_url: spotifyTrack.album.images[0]?.url || null,
            };
          } catch (error) {
            console.error(`Error processing song ${song.title}:`, error);
            return null;
          }
        })
      );
      // Filter out null results
      const validTracks = tracks.filter(Boolean);
      console.log("Final tracks to send:", validTracks);
      if (validTracks.length === 0) {
        return res.status(404).json({ error: "No tracks found" });
      }
      res.json({ tracks: validTracks });
    } catch (error) {
      console.error("Error in OpenAI or Spotify processing:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
};

