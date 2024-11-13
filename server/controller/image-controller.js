
import grid from 'gridfs-stream';
import mongoose from 'mongoose';
import File from "../model/file.js";
import mime from 'mime-types'; // Import mime-types to get file type based on extension

const url = 'http://localhost:8000';

let gfs, gridFsBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    gridFsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'files'
    });
    gfs = grid(conn.db, mongoose.mongo);
    gfs.collection('files');
});


export const uploadImage = async (request, response) => {
    if (!request.file) {
        return response.status(404).json("File not found");
    }

    // Get fileType based on file's MIME type or default to a general type if not available
    const fileType = request.file.mimetype || mime.lookup(request.file.filename) || 'application/octet-stream';

    const imageUrl = `${url}/file/${request.file.filename}`;

    const file = new File({
        filename: request.file.filename,
        fileType: fileType,
        path: request.file.path,
        size: request.file.size,
        uploadDate: request.file.uploadDate
});

    try {
        const savedFile = await file.save();  // Save metadata to MongoDB
        //console.log('Saved file metadata:', savedFile);
        response.status(200).json(imageUrl);
    } catch (error) {
        console.error('Error saving file metadata:', error);
        response.status(500).json("Error saving file metadata");
    }
};
// export const getImage = async (request, response) => {
//     try {   
//         const file = await gfs.files.findOne({ filename: request.params.filename });
//         const readStream = gridFsBucket.openDownloadStream(file._id);
//         readStream.pipe(response);
//     } catch (error) {
//         response.status(500).json({ msg: error.message });
//     }
// }
export const getImage = async (request, response) => {
    const { filename } = request.params;

    try {
        // Retrieve file metadata by filename
        const files = await gridFsBucket.find({ filename }).toArray();
        //console.log("file is found");
        
        // Check if the file exists
        if (!files || files.length === 0) {
            return response.status(404).json({ error: 'File not found' });
        }

        const file = files[0]; // Get the first file with the matching filename

        // Set headers to prompt download
        response.set({
            'Content-Type': file.contentType,
            'Content-Disposition': `attachment; filename="${file.filename}"`
        });

        // Stream the file from GridFSBucket
        const readStream = gridFsBucket.openDownloadStreamByName(filename);
        readStream.pipe(response);
    } catch (error) {
        console.error('Error retrieving file:', error);
        response.status(500).json({ error: 'Error retrieving file' });
    }
};
