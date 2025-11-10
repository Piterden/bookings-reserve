/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = async (knex) => (await knex.schema.hasTable('TABLE_NAME'))
  ? null
  : knex.schema.createTable('TABLE_NAME', (table) => {
    // columns here
  })

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const down = async (knex) => (await knex.schema.hasTable('TABLE_NAME'))
  ? knex.schema.dropTable('TABLE_NAME')
  : null
