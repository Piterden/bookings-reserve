/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const seed = async (knex) => {
  await knex('events').del()
  await knex('events').insert([
    { id: 1, name: 'Test Event 1', total_seats: 2 },
    { id: 2, name: 'Test Event 2', total_seats: 4 },
    { id: 3, name: 'Test Event 3', total_seats: 6 },
  ])
}
