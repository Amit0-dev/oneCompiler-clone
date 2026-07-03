import { createClient } from "redis"
import fs from "node:fs"
import { spawn } from "node:child_process"
import { prisma } from "./lib/prisma"

const client = await createClient({
    url: "redis://localhost:6379"
})
    .on("error", (err) => console.log("Redis client error", err))
    .connect()

while (1) {
    const response = await client.rPop("jobs")
    let finalOutput = ""
    let errorOutput = ""

    if (!response) {
        await new Promise((r) => setTimeout(r, 1000))
        continue
    }

    const { id, code, language }: {
        id: string,
        code: string,
        language: string
    } = JSON.parse(response)

    console.log(`Executing job ${id} for ${language}`)


    switch (language.toLowerCase()) {
        case "js":
            const filePath = __dirname + "/code/index.js"
            console.log("FilePath : ", filePath)

            fs.writeFileSync(filePath, code)

            const process = spawn("node", [filePath])

            process.stdout.on("data", (chunk) => {
                console.log(chunk)
                finalOutput += chunk.toString();
            })

            process.stderr.on("data", (chunk) => {
                console.log(chunk)
                errorOutput += chunk.toString();
            })

            await new Promise<void>((resolve) => {
                process.on("close", async (exitCode) => {
                    if (exitCode === 0) {
                        // now i can update records in db
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "SUCCESS",
                                stdout: finalOutput
                            }
                        })
                    } else {
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "FAILURE",
                                stderr: errorOutput
                            }
                        })
                    }
                    resolve()
                })
            })
            break;

        case "cpp":
            const cppFilePath = __dirname + "/code/a.cpp"
            console.log("cppFilePath : ", cppFilePath)

            fs.writeFileSync(cppFilePath, code)

            const cppCompileProcess = spawn("g++", [cppFilePath, "-o", "./code/out"])

            cppCompileProcess.stderr.on("data", (chunk) => {
                console.log(chunk)
                console.log("Compilation error: ", chunk.toString())
                finalOutput += chunk.toString()
            })

            let exitCode;

            await new Promise<void>((resolve) => {
                cppCompileProcess.on("close", async (code) => {
                    exitCode = code
                    if (code !== 0) {
                        // that means compilation is not successfully done
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "FAILURE",
                                stderr: finalOutput
                            }
                        })
                    }
                    resolve()
                })
            })

            if (exitCode !== 0) {
                continue;
            }

            const runProcess = spawn('./out', {
                cwd: __dirname + "/code"
            })

            runProcess.stdout.on("data", (chunk) => {
                console.log(chunk)
                finalOutput += chunk.toString()
            })

            runProcess.stderr.on("data", (chunk) => {
                console.log(chunk)
                errorOutput += chunk.toString()
            })

            await new Promise<void>((resolve) => {
                runProcess.on("close", async (code) => {
                    if (code === 0) {
                        // that means execution successfully done
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "SUCCESS",
                                stdout: finalOutput
                            }
                        })
                    } else {
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "FAILURE",
                                stderr: errorOutput
                            }
                        })
                    }
                    resolve()
                })
            })

            break;

        case "py":
            const pythonFilePath = __dirname + "/code/one.py"
            console.log("Python file path : ", pythonFilePath)

            fs.writeFileSync(pythonFilePath, code)

            const runPythonProcess = spawn("python", [pythonFilePath])

            runPythonProcess.stdout.on("data", (chunk) => {
                console.log(chunk)
                finalOutput += chunk.toString()
            })

            runPythonProcess.stderr.on("data", (chunk) => {
                console.log(chunk)
                errorOutput += chunk.toString()
            })

            await new Promise<void>((resolve) => {
                runPythonProcess.on("close", async (code) => {
                    if (code === 0) {
                        // that means execution successfully done
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "SUCCESS",
                                stdout: finalOutput
                            }
                        })
                    } else {
                        await prisma.submission.update({
                            where: {
                                id
                            },
                            data: {
                                status: "FAILURE",
                                stderr: errorOutput
                            }
                        })
                    }
                    resolve()
                })
            })

            break;

    }

}