import express from 'express';
import multer from 'multer';
import { SennseTargetService } from '../services/SennseTargetService.js';

const upload = multer({ dest: 'images/' });

const routerSennseTarget = express.Router();

routerSennseTarget.post('/sennse-target-generator', upload.array('images'), SennseTargetService);

export { routerSennseTarget };
