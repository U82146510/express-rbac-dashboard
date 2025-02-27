import { redis_client } from "../config/redis.ts";

export const set_cache = async(key:string,value:string,ttl:number=3600):Promise<void>=>{
    try {
        await redis_client.setEx(key,ttl,JSON.stringify(value));
    } catch (error) {
        console.error(error);
    }
};

export const get_cache = async(key:string):Promise<string|null|undefined>=>{
    try {
        const data = await redis_client.get(key);
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.log(error);
    }
};


export const clear_cache = async(key:string)=>{
    try {
        await redis_client.del(key);
    } catch (error) {
        console.log(error);
    }
}