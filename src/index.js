var moment = require('moment')
var uuid = require('uuid')

var { curry, compose, lensProp, set, map, join, prop, append, concat, _ } = require('ramda')

var [ subjectNode, verbNode, objectNode, actorNode, fromNode, toNode, dateSubmittedNode ] =
  map(lensProp, ['subject', 'verb', 'object', 'actor', 'from', 'to', 'dateSubmitted'])

const build = curry((type, node, object) => prop(node, object) + '-' + type)

const EventMessage = curry((subject, verb, object, actor = {}) =>
  compose(
    set(dateSubmittedNode, moment().utc().format()),
    set(toNode, '/' + join('/', [subject, verb])),
    set(fromNode, uuid.v4()),
    set(actorNode, actor),
    set(objectNode, object),
    set(verbNode, verb),
    set(subjectNode, subject)
  )({})
)

const R = curry((type, event, object) =>
  compose(
    set(lensProp('duration'), moment().diff(prop('dateSubmitted', event))),
    set(toNode, prop('from', event)),
    set(fromNode, prop('to', event)),
    set(objectNode, object),
    set(verbNode, build(type, 'verb', event)),
    set(subjectNode, build(type, 'subject', event))
  )(event)
)

const Response = R('response')
const ResponseError = R('error')


module.exports = { EventMessage, Response, ResponseError }
