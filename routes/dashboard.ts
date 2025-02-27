import { Router } from "express";
import {get_page,update_password} from '../controllers/dashboard.ts';
import {auth} from '../middleware/auth.ts';
import {verify_permission} from '../middleware/authorize.ts';

export const dashboard:Router = Router();

dashboard.get('/dashboard',auth,verify_permission(),get_page);
dashboard.put('/update',auth,verify_permission(),update_password);