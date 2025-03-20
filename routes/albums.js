import express from 'express';
import db from '../db.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

function extractYouTubeID(url) {
    console.log("extractYouTubeID received URL:", url);

    if (!url || typeof url !== "string") {
        console.error("extractYouTubeID received an invalid or undefined URL.");
        return null;
    }

    try {
        // Attempt to parse URL using the URL constructor
        const parsedUrl = new URL(url);
        const videoId = parsedUrl.searchParams.get("v");

        if (videoId) {
            return videoId;
        }

        // Handle shortened youtu.be links
        const pathnameParts = parsedUrl.pathname.split("/");
        if (pathnameParts.length > 1) {
            return pathnameParts[1]; // Extract video ID from path
        }
    } catch (error) {
        console.error("Error parsing YouTube URL:", error);
    }

    console.error("Invalid YouTube URL format:", url);
    return null;
}

async function fetchYouTubeMetadata(videoId) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet`;

  try {
      console.log(`Fetching YouTube metadata for video ID: ${videoId}`);
      
      const response = await fetch(url);
      const data = await response.json();

      console.log("YouTube API Response:", JSON.stringify(data, null, 2)); // Log full response

      if (!data.items || data.items.length === 0) {
          console.error("Error: No items found in API response.");
          return null;
      }

      const snippet = data.items[0].snippet;
      return {
          title: snippet.title,
          artist: snippet.channelTitle,  // Approximate artist name
          releaseDate: snippet.publishedAt.split("T")[0],
          image_url: snippet.thumbnails?.high?.url || ""
      };
  } catch (error) {
      console.error("Error fetching YouTube metadata:", error);
      return null;
  }
}

router.get('/', async (req, res) => {
  const albums = await db.query('SELECT * FROM albums ORDER BY id DESC');
  res.render('index', { title: "Playback Studio", albums: albums.rows });
});

router.get('/album/:id', async (req, res) => {
  const album = await db.query('SELECT * FROM albums WHERE id=$1', [req.params.id]);
  
  if (album.rows.length === 0) {
      return res.status(404).send('Album not found');
  }

  res.render('album', {
      title: album.rows[0].title, // Dynamically set the title
      album: album.rows[0]
  });
});

router.get('/add-album', (req, res) => {
  res.render('add-album', { title: "Add to Collection" });
});

router.post('/fetch-metadata', async (req, res) => {
  const { youtubeUrl } = req.body;
  const videoId = extractYouTubeID(youtubeUrl);

  if (!videoId) {
      return res.status(400).send("Invalid YouTube URL");
  }

  const metadata = await fetchYouTubeMetadata(videoId);
  if (!metadata) {
      return res.status(500).send("Error fetching metadata");
  }

  res.render('save-album', { 
      title: "Save to Collection", 
      metadata: { 
          youtube_url: youtubeUrl, 
          video_id: videoId, 
          ...metadata 
      } 
  });
});

router.post('/add-album', async (req, res) => {
  console.log("Received form data:", req.body); // Debugging step

  let { youtube_link, title, artist, release_date, description, vinyl_color, image_url } = req.body;

  try {
      if (!youtube_link) {
          console.error("ERROR: youtube_link is missing from request body.");
          return res.status(400).send("YouTube URL is required.");
      }

      console.log("Extracting YouTube ID from URL:", youtube_link);
      const videoId = extractYouTubeID(youtube_link);

      if (!videoId) {
          console.error("ERROR: Extracted YouTube ID is null.");
          throw new Error("Invalid YouTube URL provided.");
      }

      console.log("YouTube Video ID:", videoId);

      // Fetch metadata if image_url is missing
      if (!image_url) {
          const metadata = await fetchYouTubeMetadata(videoId);
          title = title || metadata?.title;
          artist = artist || metadata?.artist;
          release_date = release_date || metadata?.releaseDate;
          image_url = metadata?.image_url;
      }

      // Insert into DB with youtube_link
      await db.query(
          `INSERT INTO albums (title, artist, release_date, description, vinyl_color, image_url, youtube_link)
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [title, artist, release_date, description, vinyl_color, image_url, youtube_link]
      );

      res.redirect('/');
  } catch (error) {
      console.error("Error saving album:", error);
      res.status(500).send("Error saving album: " + error.message);
  }
});

export default router;