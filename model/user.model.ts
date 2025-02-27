import mongoose ,{ Schema,type Document,model,Types } from "mongoose";
import bcrypt from "bcryptjs";
import autopopulate from 'mongoose-autopopulate';
import {type IRoles,type IUser} from '../interfaces/user_interface.ts'


const user_schema = new Schema<IUser>({
    email:{type:String,required:true,unique:true,index:true},
    password:{type:String,required:true,minlength:6},
    role:{type:Schema.Types.ObjectId,required:true,ref:'Role',autopopulate:true}
});

const roles_schema = new Schema<IRoles>({
    role:{type:String,required:true,default:'user',enum:["admin","user","moderator"]},
    permissions:{type:[String],required:true,default:[]}
});

user_schema.plugin(autopopulate);

user_schema.pre('save',async function(next){
    try {
        if(!this.isModified('password')){
            console.log('password was updated');
            next();
        };
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    } catch (error) {
        next(error);
    }
});

export const User = model<IUser>("User",user_schema);
export const Roles = model<IRoles>("Role",roles_schema);