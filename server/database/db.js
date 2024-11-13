import mongoose from 'mongoose';
import dotenv from 'dotenv';

 dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

 const Connection = async () => {
     const URL = `mongodb://${USERNAME}:${PASSWORD}@localhost:27017/`;
    try {
           await mongoose.connect(URL, {  });
           console.log('database connected sucessfully');
    } catch (error) {
        console.log('database not connected ',error.message);

    }
 }
 export default Connection;