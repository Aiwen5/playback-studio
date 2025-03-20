import express from 'express';
import db from '../db.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

function extractYouTubeID(url) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/)([^#&?]*))/;
    const match = url.match(regex);
    return match && match[1] ? match[1] : null;
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
          thumbnail: snippet.thumbnails?.high?.url || ""
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

  res.render('save-album', { title: "Save to Collection", metadata });
});

router.get('/health', (req, res) => {
  res.send('Server is running on Vercel!');
});

router.post('/add-album', async (req, res) => {
    const { title, artist, genre, release_date, description, vinyl_color, image_url } = req.body;
    await db.query(
        `INSERT INTO albums (title, artist, genre, release_date, description, vinyl_color, image_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [title, artist, genre, release_date, description, vinyl_color, image_url]
    );
    res.redirect('/');
});

export default router;