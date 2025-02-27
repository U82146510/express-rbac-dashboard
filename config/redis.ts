import {createClient} from "redis";
import dotenv from 'dotenv';
dotenv.config();

const redis_host = process.env.redis_host;
if(!redis_host){
    throw new Error('redis connection missing');
}
export const redis_client = createClient({
    socket:{
        host:'127.0.0.1',
        port:6379
    }
});

redis_client.on('error',(error:unknown)=>{
    console.log(error);
});

redis_client.on('connect',()=>{
    console.log("Redis Connected");
});
