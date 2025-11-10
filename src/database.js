import knex from 'knex'
import knexConfig from '../knexfile.cjs'

const db = knex(knexConfig)

export const getEvent = async (eventId) => {
  const event = await db('events')
    .where({ id: eventId })
    .first()
  return event
}

export const eventIsAvailable = async (eventId) => {
  const event = await getEvent(eventId)
  const { id, total_seats } = event
  const { reserved_seats } = await db('bookings')
    .count('id AS reserved_seats')
    .where({ event_id: id })
    .first()
  return reserved_seats < total_seats
}

export const userCanReserveEvent = async (eventId, userId) => {
  const reserves = await db('bookings')
    .where({ event_id: eventId, user_id: userId })
  return reserves.length === 0
}

export const makeReserve = async (eventId, userId) => {
  const [reserve] = await db('bookings')
    .returning('id')
    .insert({ event_id: eventId, user_id: userId })
  return reserve
}
