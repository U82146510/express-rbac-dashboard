import { type Request,type Response,type NextFunction } from "express";
import {page_query_Joi,update_password_role} from '../validators/user_validator.ts';
import {type body_update_password_role} from '../interfaces/user_interface.ts';
import { User } from "../model/user.model.ts";
import bcrypt from "bcryptjs";



export const get_page = async(req:Request<{},{},{},{page:string,limit:string}>,res:Response)=>{
    try {
        const {value,error} = page_query_Joi.validate(req.query);
        if(error){
            res.status(400).json({error:error.message});
            return;
        }
        const page = parseInt(value.page) > 0 ? parseInt(value.page) : 1;
        const limit = parseInt(value.limit) > 0 ? parseInt(value.limit) : 10;
        const skip = (page-1) * limit;
        const user = await User.find().skip(skip).limit(limit);
        const total_users = await User.countDocuments();
        res.status(201).json({page,limit,data:user,total:total_users});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internalt server error'});
    }
};


export const update_password = async(req:Request<{},{},body_update_password_role>,res:Response):Promise<void>=>{
    const {value,error} = update_password_role.validate(req.body)
    try {
        if(error){
            res.status(400).json({error:error.message});
            return;
        }
        const if_exists = await User.findOneAndUpdate({email:value.email});
        if(!if_exists){
            res.status(404).json({error:'Not found'});
            return;
        };
        const get_salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(value.password,get_salt);
        const user = await User.findOneAndUpdate({email:value.email},{$set:{
            password:hashed_password
        }});
        res.status(201).json({message:'successfull updated'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'});
    }
};