const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateId);

function logRequest(request, response, next){
 
  const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`;

    console.log(logLabel);
    
    return next();

}

function validateId(request, response, next){
  const { id } = request.params;

  if(!isUuid(id))
  return response.status(400).json({error: 'Repositório inválido'});

  return next();
}

app.use(logRequest);


const repositories = [];

app.get("/repositories", (request, response) => {

  response.json(repositories);
  
});

app.post("/repositories", (request, response) => {

  const { title, url, techs} = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
 
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(400).json({error: 'Repositório não encontrado. '})
  };
  const {title, url, techs } = request.body;

  repositories[repositoryIndex].title = title;
  repositories[repositoryIndex].url = url;
  repositories[repositoryIndex].techs = techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0){
    return response.status(204).json({error: 'Não encontrado'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
  
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository)
    return response.status(400).json({error: 'Não existe o repositório'});

    repository.likes++;

    return response.status(200).json(repository)

 
});

module.exports = app;
