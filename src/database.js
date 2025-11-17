import knex from 'knex'
import knexConfig from '../knexfile.cjs'

const db = knex(knexConfig)

/**
 * Gets the event.
 *
 * @param {number} event_id The event identifier
 * @return {Promise<Event>} The event.
 */
export const getEvent = async (event_id) => {
  const event = await db('events')
    .where({ id: event_id })
    .first()
  return event
}

/**
 * Checks if event is avaailable for booking.
 *
 * @param {number} event_id The event identifier
 * @return {Promise<boolean>}
 */
export const eventIsAvailable = async (event_id) => {
  const event = await getEvent(event_id)
  const { id, total_seats } = event
  const { reserved_seats } = await db('bookings')
    .count('id AS reserved_seats')
    .where({ event_id: id })
    .first()
  return reserved_seats < total_seats
}

/**
 * Checks if user has reserved event already.
 *
 * @param {number} event_id The event identifier
 * @param {string} user_id The user identifier
 * @return {Promise<boolean>}
 */
export const userCanReserveEvent = async (event_id, user_id) => {
  const reserves = await db('bookings')
    .where({ event_id, user_id })
  return reserves.length === 0
}

/**
 * Makes a reserve.
 *
 * @param {number} event_id The event identifier
 * @param {string} user_id The user identifier
 * @return {Promise<Booking>}
 */
export const makeReserve = async (event_id, user_id) => {
  const [reserve] = await db('bookings')
    .returning('id')
    .insert({ event_id, user_id })
  return reserve
}

/**
 * Gets the top 10 users by bookings count.
 *
 * @param {string} period The period (day|week|month)
 */
export const getTop10 = async (period = 'month') => {
  const result = await db('bookings')
    .select('user_id')
    .count('id AS booking_count')
    .groupBy('user_id')
    .orderBy('booking_count', 'DESC')
    .where('created_at', '>=', knex.raw(`current_date - interval '1 ${period}'`))
  return result.map((item, idx) => { ...item, place: idx + 1 })
}
