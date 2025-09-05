import path from 'path';
import fs from 'fs';
import { OfflineCompiler } from '../image-target/offline-compiler.js';
import { loadImage } from 'canvas';
import { writeFile } from 'fs/promises';

const SennseTargetService = async (req, res) => {
    try {
        const urls = [];
        const baseUrl = `${req.protocol}://${req.get('host')}`;  // build base URL like http://localhost:3030

        for (const file of req.files) {
            const newPath = path.join('public', 'images', file.originalname);
            fs.renameSync(file.path, newPath);
            console.log(`${baseUrl}/images/${file.originalname}`);
            // Construct full URL for each image
            urls.push(`${baseUrl}/images/${file.originalname}`);
        }

        compileFromUrls(urls)
            .then(() => {
                console.log('Compilation successful');
                return res.json({ imageUrls: urls });
            })
            .catch(err => console.error('Compilation failed:', err));


    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error processing files' });
    }
};

async function compileFromUrls(imageUrls) {
    const images = await Promise.all(
        imageUrls.map((url) => {
            const filename = path.basename(url);
            const localPath = path.join('public', 'images', filename);
            return loadImage(localPath);
        })
    );

    const compiler = new OfflineCompiler();
    await compiler.compileImageTargets(images, console.log);
    const buffer = compiler.exportData();

    const dir = path.join('public', 'target');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const targetPath = path.join(dir, 'targets.mind');
    await writeFile(targetPath, buffer);
}


export { SennseTargetService };
