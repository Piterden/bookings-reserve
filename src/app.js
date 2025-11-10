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
const { APP_PORT } = process.env

const fastify = Fastify()
const ajv = new Ajv({
  removeAdditional: 'all',
  useDefaults: true,
})

fastify.post(
  '/api/bookings/reserve',
  {
    attachValidation: true,
    validatorCompiler: ({ schema }) => {
      return ajv.compile(schema)
    },
    errorHandler: (error, request, reply) => {
      reply.status(500).send({ ok: false, error: error.message })
    },
    schema: {
      body: {
        title: 'Bookings reserve DTO',
        type: 'object',
        additionalProperties: false,
        required: ['event_id', 'user_id'],
        properties: {
          event_id: { type: 'number' },
          user_id: { type: 'string' },
        },
      },
      response: {
        200: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                id: { type: 'number' },
              },
            },
          },
        },
        500: {
          type: 'object',
          properties: {
            ok: { type: 'boolean' },
            error: { type: 'string' },
          },
        },
      },
    },
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
      throw new Error(`User "id" = ${user_id} has already reserved a seat at event "id" = ${event_id}!`)
    }
    const data = await makeReserve(event_id, user_id)
    reply.send({ ok: true, data })
  }
)

fastify.listen({ port: APP_PORT, host: '0.0.0.0' })
  .then(() => { console.log(`Server is now listening on port %d.`, APP_PORT)})
  .catch(console.error)
