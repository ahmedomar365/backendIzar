import cloudinary from 'cloudinary/lib/v2';

import multer from 'multer';
import { api_key, api_secret, cloud_name } from './config';

import { Request, Response } from 'express';
import { Pool, QueryResult } from 'pg';


interface UploadedFile extends multer.File {  

    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
}

cloudinary.v2.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
  });
  

  const storage = multer.memoryStorage();

  const upload = multer({ storage });

  async function uploadImage(req: Request, res: Response): Promise<void> {
    try {
      const file = req.file as UploadedFile;
      const result = await cloudinary.v2.uploader.upload(file.buffer);
      const publicId = result.public_id;
      const url = result.secure_url;
      const query = {
        text: 'INSERT INTO images (public_id, url) VALUES ($1, $2)',
        values: [publicId, url],
      };
      await Pool.query<QueryResult>(query);
      res.send('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error uploading image');
    }
  }
  
  export { uploadImage };