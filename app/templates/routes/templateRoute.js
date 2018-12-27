const route =
  '/**\n' +
  ` *  <%= entity.entityName.toUpperCase() %>'S ROUTES\n` +
  ' */\n' +
  'routes.post(`${rootUrl}/<%= entity.entityName.toLocaleLowerCase() %>`, validate(validators.<%= entity.entityName %>Validator), handle(controllers.<%= entity.entityName %>Controller.create<%= entity.entityName %>))\n' +
  'routes.put(`${rootUrl}/<%= entity.entityName.toLocaleLowerCase() %>/:id`, validate(validators.<%= entity.entityName %>Validator), handle(controllers.<%= entity.entityName %>Controller.update<%= entity.entityName %>))\n' +
  'routes.get(`${rootUrl}/<%= entity.entityName.toLocaleLowerCase() %>`, handle(controllers.<%= entity.entityName %>Controller.getAll<%= entity.entityName %>))\n' +
  'routes.get(`${rootUrl}/<%= entity.entityName.toLocaleLowerCase() %>/:id`, handle(controllers.<%= entity.entityName %>Controller.get<%= entity.entityName %>))\n' +
  'routes.delete(`${rootUrl}/<%= entity.entityName.toLocaleLowerCase() %>/:id`, handle(controllers.<%= entity.entityName %>Controller.delete<%= entity.entityName %>))\n'
module.exports = route
