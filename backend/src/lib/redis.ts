import { createClient } from "redis"

const client = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
})

client.on("error", (err) => {
    console.error("Redis Error: ", err)
})

export async function connectRedis() {
    if (!client.isOpen) {
        await client.connect()
        console.log("Redis Client Connected")
    }
}

export default client;