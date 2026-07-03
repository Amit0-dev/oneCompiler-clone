import express from "express"
import { connectRedis } from "./lib/redis"
import codeRouter from "./routes/code"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/code", codeRouter)

async function start() {
    try {
        await connectRedis()

        app.listen(8080, () => {
            console.log("🚀 Server running on port 8080");
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

start();