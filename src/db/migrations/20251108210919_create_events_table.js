/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = async (knex) => (await knex.schema.hasTable('events'))
  ? null
  : knex.schema.createTable('events', (table) => {
    table.increments('id')
    table.string('name')
    table.integer('total_seats')
  })

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const down = async (knex) => (await knex.schema.hasTable('events'))
  ? knex.schema.dropTable('events')
  : null
