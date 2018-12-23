const <%= entity.entityName %>Model = require('../models/<%= entity.entityName %>Model')

class <%= entity.entityName %>Controller {
  async create<%= entity.entityName %> (req, res) {
    const <%= entity.entityName.toLowerCase() %>Res = await <%= entity.entityName %>Model.create(req.body)
    return res.json(<%= entity.entityName.toLowerCase() %>Res)
  }

  async update<%= entity.entityName %> (req, res) {
    const <%= entity.entityName.toLowerCase() %>Res = await <%= entity.entityName %>Model.findOneAndUpdate(req.params.id, req.body, { new: true })
    return res.json(<%= entity.entityName.toLowerCase() %>Res)
  }

  async getAll<%= entity.entityName %> (req, res) {
    const <%= entity.entityName.toLowerCase() %>Res = await <%= entity.entityName %>Model.paginate({}, {
      page: req.query.page || 1,
      limit: 20,
      sort: '-createdAt'
    })
    res.json({ <%= entity.entityName.toLowerCase() %>Res })
  }

  async get<%= entity.entityName %> (req, res) {
    const <%= entity.entityName.toLowerCase() %>Res = await <%= entity.entityName %>Model.findById(req.params.id)
    return res.json(<%= entity.entityName.toLowerCase() %>Res)
  }

  async delete<%= entity.entityName %> (req, res) {
    await <%= entity.entityName %>Model.findByIdAndDelete(req.params.id)
    return res.send()
  }
}

module.exports = new <%= entity.entityName %>Controller()
