# Code Execution Engine (Experimental)

> ⚠️ **Educational Project — Not Production Ready**

This project is an experimental implementation of a code execution engine. It accepts source code from users, queues execution requests, processes them using a worker, compiles/runs the code, captures the output, and updates the submission status.

The primary goal of this project is to understand how online judges and code execution platforms work internally.

---

# ⚠️ Disclaimer

The current implementation **executes user-submitted code directly on the host machine**.

This is **not** a secure approach and **should never be used in production**.

Running untrusted third-party code on your own server can expose your system to several security risks, including:

* Arbitrary code execution
* File system access
* Resource exhaustion (CPU, Memory, Disk)
* Network abuse
* Denial of Service (DoS)
* Potential server compromise

This repository exists purely for experimentation and learning purposes.

---

# Current Language Support

At the moment, the worker supports execution of:

* ✅ JavaScript (Node.js)
* ✅ C++
* ✅ Python

Additional languages will be added in the future.

---

# How It Works

The execution pipeline follows this flow:

```text
Frontend
    │
    ▼
User submits code
    │
    ▼
Backend API
    │
    ├── Stores submission in database
    └── Pushes a job into Redis Queue
                │
                ▼
          Redis Queue
                │
                ▼
        Worker Process
                │
                ├── Fetch next job
                ├── Create source file
                ├── Compile (if required)
                ├── Execute program
                ├── Capture stdout/stderr
                └── Determine exit status
                │
                ▼
        Update Database
                │
                ▼
Frontend polls / fetches latest result
```

---

# Execution Flow

### JavaScript

1. Worker receives the job from Redis.
2. Creates an `index.js` file.
3. Executes the file using Node.js.
4. Captures standard output and standard error.
5. Updates the submission status in the database.

---

### C++

1. Worker receives the job.
2. Creates a `.cpp` source file.
3. Compiles it using `g++`.
4. If compilation succeeds:

   * Executes the compiled binary.
   * Captures program output.
5. If compilation fails:

   * Stores compiler errors.
6. Updates the submission in the database.

---

# Technologies Used

* Node.js
* TypeScript
* Redis
* Worker Architecture
* Child Processes (`spawn`)
* PostgreSQL
* Prisma ORM

---

# Current Limitations

The current implementation intentionally keeps things simple.

Some limitations include:

* No sandboxing
* No execution timeout
* No memory limits
* No CPU limits
* No filesystem isolation
* No network isolation
* Executes directly on the host operating system

Because of these limitations, **this project should never be exposed to the public internet**.

---

# Future Improvements

The long-term goal is to execute every submission inside an isolated environment.

Planned improvements include:

* Sandboxed containers
* CPU limits
* Memory limits
* Execution time limits
* Filesystem isolation
* Support for additional programming languages
* Better monitoring and logging

---

# Learning Objectives

This project helped me understand:

* Queue-based architectures
* Redis as a job queue
* Background workers
* Child process management
* Code compilation and execution
* Capturing stdout and stderr
* Handling asynchronous processes
* Updating execution results in a database

---

# Important Note

This repository is **not intended to be an online judge or production-ready code execution service**.

It is an educational experiment built to understand the internals of code execution systems. Future versions will replace direct host execution with proper sandboxing to make the system secure and production-ready.
