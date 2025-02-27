import { type Request,type Response,type NextFunction } from "express";
import jwt from "jsonwebtoken";
import {get_cache} from '../services/cache_service.ts';

export const auth = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.token as string;
    if(!token){
        res.status(401).json({message:'token is missing'});
        return;
    }
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        if(!JWT_SECRET){
            res.status(400).json({message:'jwt secret missing'});
            return;
        }
        const black_listed = await get_cache(token);
        if(black_listed){
            res.status(403).json({message:'Token has been rewoked'});
            return;
        }
        const user = jwt.verify(token,JWT_SECRET) as {id:string;role:string};
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
    }
}