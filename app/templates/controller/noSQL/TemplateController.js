'use strict'

const <%= entity.entityName %> = require('../models/<%= entity.entityName %>')

class <%= entity.entityName %>Controller {
  async create<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.create(req.body)
      return res.status(201).json(<%= entity.entityName.toLowerCase() %>)
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async update<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.findOneAndUpdate(req.params.id, req.body, { new: true })
      return res.status(200).json(<%= entity.entityName.toLowerCase() %>)
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async getAll<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.paginate({}, {
        page: req.query.page || 1,
        limit: req.query.page || 25,
        sort: req.query.sort || '-createdAt'
      })
      res.status(200).json({ <%= entity.entityName.toLowerCase() %> })
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async get<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.findById(req.params.id)

      if (!<%= entity.entityName.toLowerCase() %>) {
        return res.status(404).json({ error: '<%= entity.entityName %> not found' })
      }

      return res.status(200).json(<%= entity.entityName.toLowerCase() %>)
    } catch (e) {
      console.trace(e)
      res.status(500).json({ error: e })
    }
  }

  async delete<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %> .findByIdAndDelete(req.params.id)

      if (!<%= entity.entityName.toLowerCase() %>) {
        return res.status(404).json({ error: '<%= entity.entityName %> not found' })
      }

      return res.status(200).json(true)
    } catch (e) {
      console.trace(e)
      res.status(500).json({ error: e })
    }
  }
}

module.exports = new <%= entity.entityName %>Controller()
