/**
 *  yarn init -y
 *  tsc --init
 *  yarn add typescript ts-node @types/node @types/express --dev
 *  yarn add express body-parser cookie-session
 *  yarn add @types/body-parser @types/cookie-session
 *  yarn add concurrently nodemon --dev
 *  yarn add mysql @types/mysql express-validator
 */
import cors from 'cors';
import path  from 'path';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { engine } from 'express-handlebars';
import { mainRouter } from './routes/mainRouter';
 
 
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, '../public'))); 
app.use(cors({credentials: true}));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars'); 
app.set('views', __dirname + '/../views'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

app.use(cookieSession({ keys: ['cookiestr'], maxAge: 24 * 60 * 60 * 5000, httpOnly: true,}));
app.use(bodyParser.urlencoded({extended: true}));  
app.use('/', mainRouter); //https://web-app-bot-b.vercel.app/?usid=User_{usid}


const port = process.env.PORT;
app.listen(port, () => { 
  console.log(`\nRunning App at localhost:${port}\n`);
});  