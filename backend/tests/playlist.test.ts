import request from "supertest";
import { app } from "../src/index";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import SpotifyWebApi from "spotify-web-api-node";
import { OpenAI } from "openai";
import type { Mock } from "jest-mock";
import type { Request, Response, NextFunction } from "express";

// Mock authentication middleware
jest.mock("../src/middleware/auth", () => ({
  authenticateToken: jest.fn((req: Request, res: Response, next: NextFunction) => {
    // Skip authentication for tests
    next();
  })
}));

// Mock the Spotify API client
jest.mock("spotify-web-api-node", () => {
  const mockSpotifyApi = {
    clientCredentialsGrant: jest.fn().mockImplementation(() => 
      Promise.resolve({
        body: { access_token: "mock-token" }
      })
    ),
    setAccessToken: jest.fn(),
    search: jest.fn().mockImplementation(() => 
      Promise.resolve({
        body: {
          tracks: {
            items: [
              {
                id: "1",
                name: "Test Song 1",
                artists: [{ name: "Test Artist 1" }],
                album: {
                  images: [{ url: "https://example.com/image1.jpg" }],
                },
              },
            ],
          },
        },
      })
    ),
    getAudioFeaturesForTrack: jest.fn().mockImplementation(() => 
      Promise.resolve({
        body: {
          valence: 0.8,
          energy: 0.7,
          danceability: 0.6,
          acousticness: 0.3,
          instrumentalness: 0.2,
          tempo: 120
        }
      })
    )
  };
  return jest.fn(() => mockSpotifyApi);
});

// Mock spotify-preview-finder
jest.mock("spotify-preview-finder", () =>
  jest.fn().mockImplementation(() =>
    Promise.resolve({
      success: true,
      results: [
        {
          name: "Test Song 1",
          previewUrls: ["https://example.com/preview1.mp3"]
        }
      ]
    })
  )
);

// Mock the OpenAI API
jest.mock("openai", () => {
  const mockOpenAI = {
    chat: {
      completions: {
        create: jest.fn().mockImplementation(() => 
          Promise.resolve({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    songs: [
                      { title: "Test Song 1", artist: "Test Artist 1" },
                      { title: "Test Song 2", artist: "Test Artist 2" },
                      { title: "Test Song 3", artist: "Test Artist 3" },
                      { title: "Test Song 4", artist: "Test Artist 4" },
                      { title: "Test Song 5", artist: "Test Artist 5" }
                    ]
                  })
                }
              }
            ]
          })
        )
      }
    }
  };
  return {
    OpenAI: jest.fn(() => mockOpenAI)
  };
});

describe("Playlist Generation API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Add a mock session token to all requests
  const mockSessionToken = "mock-session-token";
  
  it("should return 400 if emotion is missing", async () => {
    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({ memory: "test memory" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Emotion is required");
  });

  it("should return 400 if memory is missing", async () => {
    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({ emotion: "happy" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Memory is required");
  });

  it("should generate a playlist successfully", async () => {
    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({
        emotion: "happy",
        memory: "graduation day"
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tracks");
    expect(response.body.tracks).toHaveLength(5);
    expect(response.body.tracks[0]).toEqual({
      id: "1",
      name: "Test Song 1",
      artist: "Test Artist 1",
      preview_url: "https://example.com/preview1.mp3",
      image_url: "https://example.com/image1.jpg",
      audio_features: {
        valence: 0.8,
        energy: 0.7,
        danceability: 0.6,
        acousticness: 0.3,
        instrumentalness: 0.2,
        tempo: 120
      }
    });
  });

  it("should handle Spotify API errors", async () => {
    const spotifyInstance = new (SpotifyWebApi as unknown as jest.Mock)() as {
      clientCredentialsGrant: jest.Mock;
    };
    spotifyInstance.clientCredentialsGrant.mockImplementationOnce(() => 
      Promise.reject(new Error("Spotify API error"))
    );

    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({
        emotion: "happy",
        memory: "graduation day"
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to authenticate with Spotify");
  });

  it("should handle OpenAI API errors", async () => {
    const openaiInstance = new OpenAI();
    (openaiInstance.chat.completions.create as jest.Mock).mockImplementationOnce(() => 
      Promise.reject(new Error("OpenAI API error"))
    );

    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({
        emotion: "happy",
        memory: "graduation day"
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to process request");
  });

  it("should handle missing preview URL gracefully", async () => {
    const spotifyPreviewFinder = require("spotify-preview-finder");
    spotifyPreviewFinder.mockImplementationOnce(() => 
      Promise.resolve({
        success: true,
        results: [
          {
            name: "Test Song 1",
            previewUrls: []
          }
        ]
      })
    );

    const response = await request(app)
      .post("/api/playlists/generate")
      .set("Authorization", `Bearer ${mockSessionToken}`)
      .send({
        emotion: "happy",
        memory: "graduation day"
      });

    expect(response.status).toBe(200);
    expect(response.body.tracks[0].preview_url).toBeNull();
  });
});