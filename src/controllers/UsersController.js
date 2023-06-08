const AppError = require("../utils/AppError");

class UsersController {
  /**
   * Index - GET para listar todos os registros
   * Show - GET para exibir registros especificos
   * Create - POST para criar um registro
   * Put - Para atualizar um registro
   * Delete - Para remover um registro
   */
  create(request, response) {
    const { name, email, password } = request.body;
      if(!name) {
        throw new AppError("O nome é obrigatório!");
      }

    response.status(201).json({ name, email, password});
  }
}

module.exports = UsersController;
