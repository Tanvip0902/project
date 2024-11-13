import multer from 'multer';
//import { GridFsStorage } from 'multer-gridfs-storage';

import dotenv from 'dotenv';

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
//url:`mongodb://${USERNAME}:${PASSWORD}@localhost:27017/`,
const storage = multer.diskStorage({
    url:`mongodb://${USERNAME}:${PASSWORD}@localhost:27017/`,
    
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },

    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

export default multer({storage}); 
