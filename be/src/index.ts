import express from "express";
import { mainRouter } from "./routes";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1",mainRouter);

app.listen(3000,()=>{
    console.log("listening in port 3000");
})