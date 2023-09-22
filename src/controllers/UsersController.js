const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite")

class UsersController {
  /**
   * Index - GET para listar todos os registros
   * Show - GET para exibir registros especificos
   * Create - POST para criar um registro
   * Put - Para atualizar um registro
   * Delete - Para remover um registro
   */
  async create(request, response) {
    const { name, email, password } = request.body;
      /*if(!name) {
        throw new AppError("O nome é obrigatório!");
      }

      response.status(201).json({ name, email, password});
      */
      const database = await sqliteConnection();
      const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])

      if(checkUserExists){
        throw new AppError("Este e-mail esta em uso.")
      }

      const hashedPassword = await hash(password, 8);

      await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

      return response.status(201).json();
  }

  async update(request, response) {
    const {name, email, password, old_password } = request.body;
    const user_id = request.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

    if(!user) {
      throw new AppError("Usuário não encontrado")
    }

    const userWhithUpdateEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

    if(userWhithUpdateEmail && userWhithUpdateEmail.id !== user.id) {
      throw new AppError("Este e-mail já está em uso");
    }

    if(password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);

      if(!checkOldPassword) {
        throw new AppError("As sehas não conferem.");
      }

      user.password = await hash(password, 8)
    }

    if(password && !old_password){
      throw new AppError("Você precisa informar a senha antiga");
    }

    user.name = name ?? user.name; // validação para saber se existe nome - Nullish operator
    user.email = email ?? user.email; // validação para saber se existe email - Nullish operator

    await database.run(`
      UPDATE users SET
      name = (?),
      email = (?),
      password = (?),
      updated_at = DATETIME('now')
      WHERE id = (?)`,
      [user.name, user.email, user.password, user_id]
      )

      return response.json();
  }
}

module.exports = UsersController;
