import express from "express"
import { connectRedis } from "./lib/redis"

const app = express()

app.use(express.json())

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