import { Router } from "express"

const router = Router()


router.post("/submit", async (req, res) => {

    try {
        const { code, language } = req.body;

        if (!code || !language) {
            return res.status(400).json({ message: "Code and language are required" })
        }

        // save into db as status processing and dump into queue
    } catch (error) {

    }

})

router.get("/submission/:id", async (req, res) => {
    const { id } = req.params

})

export default router;
