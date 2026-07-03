import axios from "axios";

interface Response {
    language: string
    status: string
    stderr: string
    stdout: string
}



export async function pollBackend(id: string, updateOutput: (submissionOutput: Response) => void) {
    console.log("Poll Backend Called", id)
    try {
        const response = await axios.get(`http://localhost:8080/api/code/submission/${id}`)

        if (!response.data.success) {
            if (response.data.submission.status.toLowerCase() !== "processing") {
                console.log("from poll backend: ", response.data.submission)
                updateOutput(response.data.submission)
            } else {
                await new Promise(resolve => setTimeout(resolve, 3000))
                pollBackend(id, updateOutput)
            }
        }

    } catch (error) {
        console.error("Error polling backend:", error);
    }
}