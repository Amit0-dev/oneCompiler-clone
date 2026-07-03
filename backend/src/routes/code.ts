import { Router } from "express"
import { prisma } from "../lib/prisma";
import client from "../lib/redis";

const router = Router()


router.post("/submit", async (req, res) => {

    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ message: "Code and language are required" })
        }

        // save into db as status processing and dump into queue

        const submission = await prisma.submission.create({
            data: {
                code,
                language
            }
        })

        client.lPush("jobs", JSON.stringify({
            id: submission.id,
            code: submission.code,
            language: submission.language
        }))
        console.log("Push into queue..")

        return res.status(201).json({ status: "Processing", id: submission.id })
    } catch (error) {
        console.error("Code submit error:", error);
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

router.get("/submission/:id", async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Id is required" })
        }

        const submission = await prisma.submission.findUnique({
            where: {
                id
            },
            select: {
                language: true,
                status: true,
                stdout: true,
                stderr: true,
            }
        })

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" })
        }

        return res.status(200).json({ message: "Submission fetched successfully", submission, status: true })
    } catch (error) {
        console.error("Submission fetched error: ", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }

})

export default router;
