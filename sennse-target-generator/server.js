import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https'
import fs from "fs";
import cors from 'cors'

// Import your router properly
import { routerSennseTarget } from './routes/SennseTargetRoute.js';

const app = express();

// __dirname workaround in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Allow all origins (or specify your frontend origin if needed)
app.use(cors());


// Serve static folder - **fix: use express.static with absolute path and correct mount path**
app.use('/images', express.static('public/images'));
app.use('/target', express.static('public/target'));

// Routers
app.use('/api', routerSennseTarget);

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World !!',
    });
});

// Port
const PORT = process.env.PORT || 3030;

// Load SSL cert and key
const options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
};

https.createServer(options, app).listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});

// Start server With HTTP
// app.listen(PORT, () => {
//   console.log('Server is running on port ' + PORT);
// });
