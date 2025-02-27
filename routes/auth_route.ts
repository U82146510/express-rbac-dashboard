import { Router } from "express";
import {register_controller,login_controller,logout_controller,refresh_token_controller} from '../controllers/auth_controller.ts';

export const auth:Router = Router();

auth.post('/register',register_controller);
auth.post('/login',login_controller);
auth.post('/logout',logout_controller);
auth.post('/refresh_token',refresh_token_controller);
