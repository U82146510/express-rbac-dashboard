import { type Request,type Response,type NextFunction } from "express";
import {User} from '../model/user.model.ts';

const role = {
    admin:['deleteUser','createUser','updateUser',"viewUsers"],
    moderator:['updateUser','viewUsers'],
    user:['viewUsers']
};

const check_permission = (user_role:string,user_permissions:string[]):boolean=>{
    const arg:Array<string> = role[user_role];
    for(let i = 0;i<arg.length;i++){
        if(!arg.includes(user_permissions[i])){
            return false;
        }
    } 
    return true;  
};

interface IRoles {
    role:string;
    permissions:string[];
};

export const verify_permission = () =>async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
    try {
        if(!req.user?.id){
            res.status(403).json({message:'Forbidden'});
            return;
        }
        const user = await User.findById(req.user.id).populate<{role:IRoles}>('role');
        if(!user||!check_permission(user.role.role,user.role.permissions)){
            res.status(403).json({message:'Forbidden'});
            return;
        }
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({message:'Internal server error'});
    }
};