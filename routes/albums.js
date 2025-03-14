import express from 'express';
import db from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const albums = await db.query('SELECT * FROM albums ORDER BY id DESC');
    res.render('index', { albums: albums.rows });
});

router.get('/album/:id', async (req, res) => {
    const album = await db.query('SELECT * FROM albums WHERE id=$1', [req.params.id]);
    res.render('album', { album: album.rows[0] });
});

router.get('/add-album', (req, res) => {
    res.render('add-album');
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