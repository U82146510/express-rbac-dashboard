import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const atlas_mongodb = process.env.atlas_mongodb;


if(!atlas_mongodb){
    throw new Error('connection string is missing');
}

export const connect_to_mongo = async()=>{
    try {
        await mongoose.connect(atlas_mongodb);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const first_db:mongoose.Connection=mongoose.connection;

first_db.on('error',(error:unknown)=>{
    console.error(error);
});


first_db.on('disconnected',(error:unknown)=>{
    console.error(error);
});


first_db.on('connected',()=>{
    console.log('firs_db connected');
});