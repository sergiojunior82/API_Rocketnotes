require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations/");

const AppError = require("./utils/AppError");
const express = require("express");

const routes = require("./routes"); // vai carregar por padrão o arquivo index.js
const usersRoutes = require("./routes/users.routes");

migrationsRun();

const app = express();
app.use(express.json());

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



const PORT = 3333;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));