import express from 'express';

import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
const port =  parseInt(process.env.PORT) || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});
 
app.listen(port, () => {
  console.log(`Taulukko: listening on port ${port}`);
});