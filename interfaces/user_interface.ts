import {type Document,model,Types } from "mongoose";
export interface reqister_body{
    email:string;
    password:string;
    role:string;
    permissions:string[];
};

export interface login_body{
    email:string;
    password:string;
};

export interface IRoles extends Document{
    role:"admin"|"user"|"moderator";
    permissions:string[];
};

export interface IUser extends Document{
    email:string;
    password:string;
    role:Types.ObjectId | IRoles;
};

export interface body_update_password_role{
    email:string;
    password:string;
    role:string;
}