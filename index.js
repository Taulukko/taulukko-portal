import express from 'express';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'; 


const app = express();
const port =  parseInt(process.env.PORT) || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//midleware to redirect content to public
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
//midleware to redirect content unknown to public
app.use((req, res, next) => {
  res.redirect('/');
});
app.listen(port, () => {
  console.log(`Taulukko: listening on port ${port}`);
});

