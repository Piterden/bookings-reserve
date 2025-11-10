import Ajv from 'ajv'
import dotenv from 'dotenv'
import Fastify from 'fastify'
import {
  getEvent,
  makeReserve,
  eventIsAvailable,
  userCanReserveEvent,
 } from './database.js'

dotenv.config()

const fastify = Fastify()
const ajv = new Ajv({
  removeAdditional: 'all',
  useDefaults: true,
})

fastify.setValidatorCompiler(({ schema, method, url, httpPart }) => {
  return ajv.compile(schema)
})

fastify.setErrorHandler((error, request, reply) => {
  reply.status(500).send({ ok: false, error: error.message })
})

const schema = {
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['event_id', 'user_id'],
    properties: {
      event_id: { type: 'number' },
      user_id: { type: 'string' },
    },
  },
}

fastify.post(
  '/api/bookings/reserve',
  {
    schema,
    attachValidation: true,
  },
  async (request, reply) => {
    if (request.validationError) {
      throw new Error(request.validationError)
    }

    const { event_id, user_id } = request.body

    if (!await getEvent(event_id)) {
      throw new Error(`Event "id" = ${event_id} doesn't exist!`)
    }

    if (!await eventIsAvailable(event_id)) {
      throw new Error(`All seats for event "id" = ${event_id} have been reserved already!`)
    }

    if (!await userCanReserveEvent(event_id, user_id)) {
      throw new Error(`User "id" = ${user_id} has reserved a seat at this event already!`)
    }

    const data = await makeReserve(event_id, user_id)
    reply.send({ ok: true, data })
  })

fastify.listen({
  port: process.env.APP_PORT,
  host: '0.0.0.0',
})
  .then(() => {
    console.log(`Server is now listening on ${process.env.APP_PORT} port.`)
  })
  .catch(console.error)


