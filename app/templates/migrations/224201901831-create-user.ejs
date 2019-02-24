'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('<%= entity.entityName %>', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },<% for(let i=0; i< field.length; i++) { %>
      <%= field[i].fieldName %>: {
        type: Sequelize.<%= field[i].fieldType === 'Number' ? 'INTEGER' : field[i].fieldType.toUpperCase() %>,
        allowNull: <%= field[i].required === true ? 'false' : 'true' %>,
      },<% } %>
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('<%= entity.entityName %>', {})
  }
}
