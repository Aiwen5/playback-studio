import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import albumRoutes from './routes/albums.js';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log("Request Body:", req.body);
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
      }
  }
}));

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(methodOverride('_method'));

// Routes
app.use('/', albumRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));