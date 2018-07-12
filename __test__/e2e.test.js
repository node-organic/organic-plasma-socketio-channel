const Plasma = require('organic-plasma')
const SocketIOChannelServer = require('../env/server')
const SocketIOChannelClient = require('../env/client')
const SocketIOServer = require('organic-socketio-server')

test('delivers chemicals', (done) => {
  let serverPlasma = new Plasma()
  let clientPlasma = new Plasma()
  let buildServerOrganelles = [
    () => {
      return new SocketIOServer(serverPlasma, {
        'emit': {
          'ready': 'SocketIO',
          'connection': 'SocketIOConnection'
        },
        'port': 1337
      })
    },
    () => {
      return new SocketIOChannelServer(serverPlasma, {
        'reactOnConnection': 'SocketIOConnection',
        'transportChemicalsShape': {
          'socketio': true
        }
      })
    }
  ]
  let buildClientOrganelles = [
    () => {
      return new SocketIOChannelClient(clientPlasma, {
        'transportChemicalsShape': {
          'socketio': true
        },
        'emitReady': 'SocketIO',
        'port': 1337
      })
    }
  ]
  buildServerOrganelles.map(fn => fn())

  serverPlasma.on('SocketIO', () => {
    buildClientOrganelles.map(fn => fn())
    clientPlasma.on('SocketIO', () => {
      let type1Delivered = false
      let type2Delivered = false
      clientPlasma.on({type: '2'}, () => {
        type2Delivered = true
      })
      serverPlasma.on({type: '1'}, () => {
        type1Delivered = true
      })
      clientPlasma.emit({
        type: '1',
        socketio: true
      })
      serverPlasma.emit({
        type: '2',
        socketio: true
      })
      // delay killing cells to leave space for delivery of the chemicals
      setTimeout(() => {
        serverPlasma.emit('kill')
        clientPlasma.emit('kill')
        expect(type1Delivered).toEqual(true)
        expect(type2Delivered).toEqual(true)
        done()
      }, 1000)
    })
  })
})
