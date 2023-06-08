const { Router } = require("express");
const ProductsController = require("../controllers/ProductsController")
const productsRoutes = Router();


/*
productsRoutes.post("/", (request, response) => {
  const { id, name, value } = request.body;
  //response.send(`Usuário: ${name} - Email: ${email} - Senha: ${password}`);
  response.json({ id, name, value })
});
*/

function myMiddleware(request, response, next) {
  console.log("Você entrou no middleware");
  console.log(request.body);
   if(request.body.isAtive != true){
    return response.json({message: "product unauthorized"})
   }
  next();
}

const productsController = new ProductsController();

productsRoutes.post("/", myMiddleware, productsController.create)

module.exports = productsRoutes;