import express,{type Application} from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit'; 
import {redis_client} from './config/redis.ts';
import {connect_to_mongo} from './config/config.ts';
import {auth} from './routes/auth_route.ts';
import {dashboard} from './routes/dashboard.ts';


const app:Application = express();
const port:number = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

const limiter = rateLimit({
    windowMs:15*60*1000,
    max:100,
    message:'Too many request from this IP, please try again later'
});

app.use(limiter);
app.use('/',auth);
app.use('/',dashboard);


const start = async()=>{
    try {
        await redis_client.connect();
        await connect_to_mongo()
        app.listen(port,()=>console.log("On"));
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

start()
