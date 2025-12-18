
import express, { Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routers/user.router';
import postRoutes from './routers/post.router'


dotenv.config();
const app = express();
const PORT = Number(process.env.PORT)
const BASE_URL = String(process.env.BASE_URL)
const DB_URL = String(process.env.DB_URL)

app.get('/', (req, res) => {
  res.send('Welcome to SE NPRU BLog RestFul API!');
});



app.use(cors({
  origin:["http://localhost:5173","127.0.0.1:5173", BASE_URL],
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type","Authorization","x-access-token"]
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes)


if(!DB_URL){
    console.error("DB_URL is not defined in .env file")
}else{
    mongoose.connect(DB_URL).then(() =>{
        console.log("Connected to MongoDB Successfully!");
    }).catch((error) => {
        console.error("MongoDB connection error:", error)
    }
    )
}
/* ... routes ... */

app.listen(PORT,() =>
  console.log(`Server on ${PORT}`)
);

