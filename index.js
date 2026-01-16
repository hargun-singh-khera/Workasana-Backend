const express = require("express");
const app = express()
require("dotenv").config()
const PORT = process.env.PORT

const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/user.model");
const Task = require("./models/task.model");
const Team = require("./models/team.model");
const Project = require("./models/project.model");
const Tag = require("./models/tag.model");
const { connectDB } = require("./db/db.connect");

const corsOptions = {
    origin: "*",
    credentials: true,
}

const JWT_SECRET = "jwt_secret";

connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors(corsOptions))

const verfiyJWT = async (req, res, next) => {
    const token = req.headers["authorization"]
    console.log("token", token)
    if(!token) {
        return res.status(401).json({ message: "No token provided" })
    }
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET)
        req.user = decodedToken
        next()
    } catch (error) {
        console.log("Error while verifying token", error.message)
        return res.status(401).json({ message: "Invalid token provided" })
    }
}

// signup
app.post("/auth/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required "})
        }
        const userExists = await User.findOne({ email })
        if(userExists) {
            return res.status(409).json({ message: "User already exists "})
        }
        const user = new User({ name, email, password })
        await user.save()
        return res.status(201).json({ message: "User registered successfully", user })
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" })
        console.log("Error while registering user", error.message)
    }
})

// login
app.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required "})
        }
        const user = await User.findOne({ email })
        if(!user) {
            return res.status(400).json({ message: "User not found "})
        }
        if(password === user.password) {
            const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: "1d"})
            return res.status(200).json({ message: "User logged in successfully" , token })
        } else {
            return res.status(400).json({ message: "Invalid credentials " })
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to login "})
        // console.log("Error while logging in user", error.message)
    }
})

// user details
app.get("/auth/me", verfiyJWT, async (req, res) => {
    try {
        const { email } = req.user
        return res.status(200).json({ email })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user detail" })
        // console.log("Error while getting user details", error.message)
    }
})

// create new task
async function createTask(data) {
    try {
        const { name, project, team, owners, tags, timeToComplete, status } = data
        if(!name || !project || !team || !Array.isArray(owners) || !owners.length || timeToComplete === null || !status) {
            return res.status(400).json({ message: "All fields are required "})
        }
        const task = new Task(data)
        await task.save()
        return task
    } catch (error) {
        throw error
    }
}

app.post("/tasks", verfiyJWT, async (req, res) => {
    try {
        const task = await createTask(req.body)
        return res.status(201).json({ message: "Task created successfully", task })
    } catch (error) {
        res.status(500).json({ error: "Failed to create task "})
        // console.log("Error while creating task", error.message)
    }
})

// get all tasks 
async function getTasks() {
    try {
        const tasks = await Task.find()
        return tasks
    } catch (error) {
        throw error
    }
}

app.get("/tasks", verfiyJWT, async (req, res) => {
    try {
        const tasks = await getTasks()
        return res.status(200).json({ tasks })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks "})
        // console.log("Error while getting tasks", error.message)
    }
})

// update task
async function updateTask(id, data) {
    try {
        const task = await Task.findByIdAndUpdate(id, data, { new: true })
        return task
    } catch (error) {
        throw error        
    }
}

app.post("/tasks/:id", verfiyJWT, async (req, res) => {
    try {
        const task = await updateTask(req.params.id, req.body)
        return res.status(200).json({ message: "Task updated successfully", task })
    } catch (error) {
        res.status(500).json({ error: "Failed to update task "})
        // console.log("Error while updating task", error.message)
    }
})

// delete task
async function deleteTask(id) {
    try {
        await Task.findByIdAndDelete(id)
    } catch (error) {
        throw error
    }
}

app.delete("/tasks/:id", verfiyJWT, async (req, res) => {
    try {
        await deleteTask(req.params.id) 
        return res.status(200).json({ message: "Task deleted successfully "})       
    } catch (error) {
        res.status(500).json({ error: "Failed to delete task" })
        // console.log("Error while deleting task", error.message)
    }
})

// add team
async function addTeam(data) {
    try {
        const { name } = data
        if(!name) {
            return res.status(400).json({ message: "Name is required "})
        }
        const team = new Team(data)
        await team.save()
        return team
    } catch (error) {
        throw error
    }
}

app.post("/teams", verfiyJWT, async (req, res) => {
    try {
        const team = await addTeam(req.body)
        return res.status(201).json({ message: "Team created successfully", team })        
    } catch (error) {
        res.status(500).json({ error: "Failed to create team" })
        // console.log("Error while creating team", error.message)
    }
})

// get all teams
async function getTeams() {
    try {
        const teams = await Team.find()
        return teams
    } catch (error) {
        throw error        
    }
}

app.get("/teams", verfiyJWT, async (req, res) => {
    try {
        const teams = await getTeams()
        return res.status(200).json({ message: "Teams fetched successfully", teams })
    } catch (error) {
        console.log("Error while getting teams", error.message)
    }
})

// add project
async function addProject(data) {
    try {
        const { name } = data
        if(!name) {
            return res.status(400).json({ message: "Name is required "})
        }
        const project = new Project(data)
        await project.save()
        return project
    } catch (error) {
        throw error        
    }
}

app.post("/projects", verfiyJWT, async (req, res) => {
    try {
        const project = await addProject(req.body)
        return res.status(201).json({ message: "Project created successfully", project })
    } catch (error) {
        res.status(500).json({ error: "Failed to add project" })
    }
})

// get projects
async function getProjects() {
    try {
        const projects = await Project.find()
        return projects
    } catch (error) {
        throw error        
    }
}

app.get("/projects", verfiyJWT, async (req, res) => {
    try {
        const projects = await getProjects()
        return res.status(200).json({ message: "Projects fetched successfully", projects })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch projects "})
        // console.log("Error while getting projects", error.message)
    }
})

// add tag
async function addTag (data) {
    try {
        const tag = new Tag(data)
        await tag.save()
        return tag
    } catch (error) {
        throw error        
    }
}

app.post("/tags", verfiyJWT, async (req, res) => {
    try {
        const tag = await addTag(req.body)
        return res.status(201).json({ message: "Tag created successfully", tag })
    } catch (error) {
        res.status(500).json({ error: "Failed to add tag"})
        // console.log("Error while creating tag", error.message)
    }
})

// get tags
async function getTags() {
    try {
        const tags = await Tag.find()
        return tags
    } catch (error) {
        throw error        
    }
}

app.get("/tags", verfiyJWT, async (req, res) => {
    try {
        const tags = await getTags(req.body)
        return res.status(200).json({ message: "Tags fetched successfully", tags })
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tags." })
        // console.log("Error while getting tags", error.message)
    }
})

// reports
// app.get("/report/last-week", async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

// app.get("/report/pending", async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

// app.get("/report/closed-tasks", async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))