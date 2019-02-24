'use strict'

const Joi = require('joi')

module.exports = {
  body: {<% for(let i=0; i< field.length; i++) { %><%if (field[i].addValid) { %><%if (field[i].required && field[i].minMax) { %>
    <%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>().required().min(<%= field[i].minimum %>).max(<%= field[i].maximum %>),<%}else if(field[i].required === false && field[i].minMax){%>
    <%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>().min(<%= field[i].minimum %>).max(<%= field[i].maximum %>),<% }else if(field[i].required && field[i].minMax === false) {%>
    <%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>().required(),<% } %> <% }else { %>
    <%= field[i].fieldName %>: Joi.<%= field[i].fieldType.toLowerCase() %>(),<% } %><% } %>
  }
}
