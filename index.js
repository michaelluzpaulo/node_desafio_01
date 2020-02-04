const express = require("express");
const server = express();

server.use(express.json());


const projects = [];


function checkProjectExist(req, res, next) {
    const id = req.params.id;
    const project = projects.find(proj => proj.id == id);
    if (!project) {
        return res.status(400).json({ error: "Projeto não existente" });
    }

    return next();
}

function logRequests(req, res, next) {
    console.count("Número de requisições");
    return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
    return res.json(projects);
});

server.post('/projects', (req, res) => {
    const { id, title } = req.body;
    const project = { id: id, title: title, tasks: [] }
    projects.push(project);

    return res.json(projects);
});

server.put('/projects/:id', checkProjectExist, (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    const project = projects.find(proj => proj.id == id);

    project.title = title;
    return res.json(project);
});

server.delete('/projects/:id', checkProjectExist, (req, res) => {
    const id = req.params.id;
    const projectIndex = projects.findIndex(proj => proj.id == id);

    projects.splice(projectIndex, 1);
    return res.send();
});

server.post('/projects/:id/tasks', checkProjectExist, (req, res) => {
    const id = req.params.id;
    const { title } = req.body;
    const project = projects.find(proj => proj.id == id);

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3000);