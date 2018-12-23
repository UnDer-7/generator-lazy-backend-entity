const mongoose = require('mongoose')
const paginate = require('mongoose-paginate')

const <%= entity.entityName %>Schema = new mongoose.Schema({ <% for(let i=0; i< field.length; i++) { %>
  <%= field[i].fieldName %>: {
    type: <%= field[i].fieldType %>,
    required: <%= field[i].required %>
  },<% } %>
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

<%= entity.entityName %>Schema.plugin(paginate)
module.exports = mongoose.model('<%= entity.entityName %>', <%= entity.entityName %>Schema)
