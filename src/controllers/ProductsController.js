
class ProductsController {
  create(request, response) {
    const { id, name, value } = request.body;
  
    response.json({ id, name, value })
  }
}

module.exports = ProductsController;