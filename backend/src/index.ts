import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB";
dotenv.config();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user-routes";
import restaurantRoutes from "./routes/restaurant-routes"
import menuRoutes from "./routes/menu-routes";
import orderRoutes from "./routes/order-routes"
import path from "path"; 



const app = express();

const PORT = process.env.PORT || 3000;

 

const Dirname = path.resolve();
console.log(Dirname)


// default middlewares
app.use(bodyParser.json({limit: "10mb"}));
app.use(express.urlencoded({extended: true, limit: "10mb"}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: "http://localhost:5173",
	credentials: true
}));

// all api's
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use("/api/v1/menu", menuRoutes);
app.use("/api/v1/order", orderRoutes);


// serve frontend from backend
app.use(express.static(path.join(Dirname, "/frontend/dist")));

// express v4 --> error
// app.get("*", (_, res) => {
// 	res.sendFile(path.resolve(Dirname, "frontend", "dist", "index.html"));
// }) 

// express v5 --> error
app.get("/*splat", (_, res) => {
	res.sendFile(path.resolve(Dirname, "frontend", "dist", "index.html"));
}) 



app.listen(PORT, () => {
	connectDB();
	console.log(`server is running on port ${PORT}`)
});


    // "dev": "ts-node-dev --respawn --transpile-only backend/src/index.ts"