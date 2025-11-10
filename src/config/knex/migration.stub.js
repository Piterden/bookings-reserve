const tableName = "TABLE_NAME"

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = async (knex) => {
  if (!await knex.schema.hasTable(tableName)) {
    return knex.schema.createTable(tableName, (table) => {
      // columns here
    })
  }
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const down = async (knex) => {
  if (await knex.schema.hasTable(tableName)) {
    return knex.schema.dropTable(tableName)
  }
}
