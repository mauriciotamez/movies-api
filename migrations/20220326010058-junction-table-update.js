'use strict'

const query = require('express/lib/middleware/query')

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.addColumn(
        'actor_movie_junction',
        'createdAt',
        {
          type: Sequelize.DATE
        }
      ),
      queryInterface.addColumn(
        'actor_movie_junction',
        'updatedAt',
        {
          type: Sequelize.DATE
        }
      ),
      queryInterface.addColumn(
        'actor_movie_junction',
        'movieId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'movie',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      ),
      queryInterface.addColumn(
        'actor_movie_junction',
        'actorId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'actor',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        }
      )
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn(
        'actor_movie_junction',
        'createdAt'
      ),
      queryInterface.removeColumn(
        'actor_movie_junction',
        'updatedAt'
      ),
      queryInterface.removeColumn(
        'actor_movie_junction',
        'movie_id'
      ),
      queryInterface.removeColumn(
        'actor_movie_junction',
        'actor_id'
      )
    ])
  }
}
