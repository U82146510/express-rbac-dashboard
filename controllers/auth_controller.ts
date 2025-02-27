import {type Request,type Response,type NextFunction} from "express";
import {type reqister_body,type login_body} from '../interfaces/user_interface.ts';
import {register_Joi,login_Joi} from '../validators/user_validator.ts';
import {User,Roles} from '../model/user.model.ts';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {type IRoles} from '../interfaces/user_interface.ts';
import {set_cache} from '../services/cache_service.ts';


const jwt_token = (payload):Promise<string|undefined>=>{
    return new Promise((resolve,reject)=>{
        const JWT_SECRET = process.env.JWT_SECRET;
        if(!JWT_SECRET){
            throw new Error('missing jwt secret');
        }
        const token = jwt.sign(payload,JWT_SECRET,{expiresIn:'15m'},(err,token)=>{
            if(err){
                reject(err);
            }
            resolve(token);
        });
    }); 
};


const jwt_refresh_token = async(payload):Promise<string|undefined>=>{
    return new Promise((resolve,reject)=>{
        const JWT_REFRESH = process.env.JWT_REFRESH;
        if(!JWT_REFRESH){
            throw new Error("missing jwt refresh secret");
        }
        const token = jwt.sign(payload,JWT_REFRESH,{expiresIn:'7d'},(err,token)=>{
            if(err){
                reject(err)
            }
            resolve(token);
        });
    });
};

export const register_controller = async(req:Request<{},{},reqister_body>,res:Response,next:NextFunction):Promise<void>=>{
    const {value,error} = register_Joi.validate(req.body);
    try {
        if(error){
            res.status(400).json({error:error.message});
            return;
        }
        const if_user_exist = await User.findOne({email:value.email});
        if(if_user_exist){
            res.status(409).json({message:'user already exist'});
            return;
        };
        const permision = await Roles.create({role:value.role});
        for(const arg of value.permissions){
            permision.permissions.push(arg);
        }
        permision.save();
        const user = await User.create({email:value.email,password:value.password,role:permision._id});
        res.status(201).json({message:'success'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal server error"});
    }
};


export const login_controller = async(req:Request<{},{},login_body>,res:Response,next:NextFunction):Promise<void>=>{
    const {value,error} = login_Joi.validate(req.body);
    try {
        if(error){
            res.status(400).json({error:error.message});
            return;
        }
        const user = await User.findOne({email:value.email});
        if(!user){
            res.status(404).json({message:'not found'});
            return;
        }
        const compare_password = bcrypt.compare(value.password,user.password);
        if(!compare_password){
            throw new Error('password is incorrect!');
        }

        const {role} = (user.role as IRoles);
        const token = await jwt_token({id:user.id,role}); // here is a mistake, it should be user id not role id
        const refresh_token = await jwt_refresh_token({id:user.id,role});
        console.log(refresh_token);
        console.log(user.id)
        res.cookie("refresh_token",refresh_token,{
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({message:'success',token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'});
    }
};


export const logout_controller = async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const token = req.headers.refres_token as string;
        const {id} = jwt.decode(token) as {id:string};
        console.log(id);
        set_cache(id,token);
        res.status(201).json({message:'logout'})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'});
    }
};


export const refresh_token_controller = async (req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        const JWT_REFRESH = process.env.JWT_REFRESH;
        if(!JWT_REFRESH){
            throw new Error("missing jwt refresh secret");
        }
        const refresh_token = req.headers.refresh_token as string;
        console.log("Refresh TOKEN",refresh_token);
        if(!refresh_token){
            res.status(400).json({error:'Refresh token is required'});
            return;
        }
        const verify_token = jwt.verify(refresh_token,JWT_REFRESH) as jwt.JwtPayload;
        const { exp, iat, ...userPayload } = verify_token;
        if (!userPayload) {
            res.status(401).json({ message: "User not authenticated" });
            return;
        } 
        req.user = userPayload as {id:string;role:string};
        console.log(req.user);
        const token = await jwt_token(userPayload);
        res.status(201).json({token:token})
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === "TokenExpiredError") {
                res.status(401).json({ error: "Refresh token expired" });
                return;
            }
            if (error.name === "JsonWebTokenError") {
                res.status(401).json({ error: "Invalid refresh token" });
                return;
            }
        }

        console.error("Internal Server Error:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
};