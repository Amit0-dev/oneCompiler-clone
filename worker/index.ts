import { createClient } from "redis"

const client = await createClient({
    url: "redis://localhost:6379"
})
    .on("error", (err) => console.log("Redis client error", err))
    .connect()

while (1) {
    const code = await client.rPop("jobs")

    if (!code) {
        await new Promise((r) => setTimeout(r, 1000))
        continue
    }

    if (code) {
        console.log("Processing " + code)
    }
}