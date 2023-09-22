require("dotenv/config");
require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations/");

const AppError = require("./utils/AppError");
const uploadConfig = require('./configs/upload');
const cors = require("cors");

const express = require("express");

const routes = require("./routes"); // vai carregar por padrão o arquivo index.js
const usersRoutes = require("./routes/users.routes");

migrationsRun();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(( error, request, response, next ) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    })

  }

  console.error(error);

  return response.status(500).json({
    status: "error",
    message: error.message
  })
});

/*

// Metodo GET com Route Params
/*
app.get("/message/:id/:user", (request, response) => {
  const { id, user} = request.params;
  response.send(`O ID da mensagem: ${id}. Usuário da mensagem é: ${user}`);
})
*/

// Metodo GET com Query Params
/*
app.get("/users", (request, response) => {
  const { page, limit } = request.query;
  response.send(`A pagina é: ${page}. O limit é: ${limit}`);
});
*/

// Metodo POST - vou passar para routes/users.routes.js
/*
app.post("/users", (request, response) => {

  const { name, email, password } = request.body;
  //response.send(`Usuário: ${name} - Email: ${email} - Senha: ${password}`);
  response.json({ name, email, password })

});
*/

const PORT = process.env.SERVER_PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));