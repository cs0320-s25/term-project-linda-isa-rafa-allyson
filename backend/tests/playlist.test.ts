import request from "supertest";
import { app } from "../src/index";
import { jest } from "@jest/globals";

// Mock the Spotify API client
jest.mock("spotify-web-api-node", () => {
  return jest.fn().mockImplementation(() => ({
    clientCredentialsGrant: jest.fn().mockResolvedValue({
      body: { access_token: "mock-token" },
    }),
    searchTracks: jest.fn().mockResolvedValue({
      body: {
        tracks: {
          items: [
            {
              id: "1",
              name: "Test Song 1",
              artists: [{ name: "Test Artist 1" }],
              preview_url: "https://example.com/preview1.mp3",
              album: {
                images: [{ url: "https://example.com/image1.jpg" }],
              },
            },
          ],
        },
      },
    }),
  }));
});

// Mock the OpenAI API
jest.mock("openai", () => {
  return {
    OpenAI: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    songs: [
                      {
                        name: "Test Song 1",
                        artist: "Test Artist 1",
                        emotion: "happy",
                        reason: "This song matches your happy mood",
                      },
                    ],
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe("Playlist Generation API", () => {
  it("should return 400 if emotion is missing", async () => {
    const response = await request(app)
      .post("/api/playlists/generate")
      .send({ memory: "test memory" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Emotion is required");
  });

  it("should return 400 if memory is missing", async () => {
    const response = await request(app)
      .post("/api/playlists/generate")
      .send({ emotion: "happy" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Memory is required");
  });

  it("should generate a playlist successfully", async () => {
    const response = await request(app).post("/api/playlists/generate").send({
      emotion: "happy",
      memory: "graduation day",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tracks");
    expect(response.body.tracks).toHaveLength(1);
    expect(response.body.tracks[0]).toEqual({
      id: "1",
      name: "Test Song 1",
      artist: "Test Artist 1",
      preview_url: "https://example.com/preview1.mp3",
      image_url: "https://example.com/image1.jpg",
    });
  });

  it("should handle Spotify API errors", async () => {
    // Mock Spotify API error
    const spotifyMock = require("spotify-web-api-node");
    spotifyMock.mockImplementation(() => ({
      clientCredentialsGrant: jest
        .fn()
        .mockRejectedValue(new Error("Spotify API error")),
    }));

    const response = await request(app).post("/api/playlists/generate").send({
      emotion: "happy",
      memory: "graduation day",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to authenticate with Spotify");
  });

  it("should handle OpenAI API errors", async () => {
    // Mock OpenAI API error
    const openaiMock = require("openai");
    openaiMock.OpenAI.mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockRejectedValue(new Error("OpenAI API error")),
        },
      },
    }));

    const response = await request(app).post("/api/playlists/generate").send({
      emotion: "happy",
      memory: "graduation day",
    });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to process with OpenAI");
  });
});
