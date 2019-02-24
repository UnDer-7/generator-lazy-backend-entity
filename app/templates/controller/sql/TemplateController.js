'use strict'

const { <%= entity.entityName %> } = require('../models')

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

  async <%= entity.entityName %>User (req, res) {
    try {
      const [numberOfAffectedRows, [updated<%= entity.entityName %>]] = await <%= entity.entityName %>.update(req.body,
        {
          returning: true,
          individualHooks: true,
          where: { id: req.params.id }
        })
      res.status(updated<%= entity.entityName %> ? 200 : 404).json(updated<%= entity.entityName %>)
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async getAll<%= entity.entityName %> (req, res) {
    const { page = 1, paginate = 25 } = req.query

    const options = {
      page: page,
      paginate: paginate
    }

    try {
      const { docs, pages, total } = await <%= entity.entityName %>.paginate(options)
      return res.status(200).json({ docs, pages: pages, total: total })
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async get<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.findByPk(req.params.id)
      return res.status(<%= entity.entityName.toLowerCase() %> ? 200 : 404).json(<%= entity.entityName.toLowerCase() %>)
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }

  async delete<%= entity.entityName %> (req, res) {
    try {
      const <%= entity.entityName.toLowerCase() %> = await <%= entity.entityName %>.destroy({
        where: { id: req.params.id },
        limit: 1
      })
      return res.status(<%= entity.entityName.toLowerCase() %> ? 200 : 400).json({ rowsDeleted: <%= entity.entityName.toLowerCase() %> })
    } catch (e) {
      console.trace(e)
      return res.status(500).json({ error: e })
    }
  }
}

module.exports = new <%= entity.entityName %>Controller()
