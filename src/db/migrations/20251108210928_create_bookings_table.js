/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = async (knex) => (await knex.schema.hasTable('bookings'))
  ? null
  : knex.schema.createTable('bookings', (table) => {
    table.increments('id')
    table.integer('event_id').references('id').inTable('events')
    table.string('user_id')
    table.timestamp('created_at').defaultTo(knex.fn.now())

    table.unique(['event_id', 'user_id'])
  })

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const down = async (knex) => (await knex.schema.hasTable('bookings'))
  ? knex.schema.dropTable('bookings')
  : null
