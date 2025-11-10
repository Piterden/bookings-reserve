/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('TABLE_NAME').del()
  await knex('TABLE_NAME').insert([
    { id: 1, colName: 'rowValue1' },
    { id: 2, colName: 'rowValue2' },
    { id: 3, colName: 'rowValue3' },
  ])
}
