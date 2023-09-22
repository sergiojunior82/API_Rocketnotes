const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const UserAvatarController = require("../controllers/UserAvatarController");
const ensureAuthenticated = require("../middleware/ensureAuthenticated");
const multer = require('multer');
const uploadConfig = require('../configs/upload');

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();
const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);


usersRoutes.post("/", usersController.create);
usersRoutes.put("/", ensureAuthenticated, usersController.update);

usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

//usersRoutes.post("/", myMiddleware, usersController.create)

//exportando para acessar fora
module.exports = usersRoutes;