declare module "spotify-preview-finder" {
  interface SongResult {
    name: string;
    spotifyUrl: string;
    previewUrls: string[];
  }

  interface SearchResult {
    success: boolean;
    results: SongResult[];
    error?: string;
  }

  function spotifyPreviewFinder(
    songName: string,
    limit?: number
  ): Promise<SearchResult>;
  export default spotifyPreviewFinder;
}
