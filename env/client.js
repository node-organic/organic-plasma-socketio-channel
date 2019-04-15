const io = require('socket.io-client')

module.exports = class SocketIOClientChannel {
  constructor (plasma, dna) {
    if (!dna.port && !dna.endpoint) throw new Error('port or endpoint required in dna')
    this.idMarker = Math.random()
    this.plasma = plasma
    this.dna = dna
    let connectStr = `http://localhost:${dna.port}`
    if (dna.endpoint) {
      connectStr = dna.endpoint
    }
    this.io = io(connectStr, {
      transports: ['websocket']
    })
    this.io.on('chemical', (c, callback) => {
      Object.defineProperty(c, this.idMarker, {enumerable: false, value: true})
      this.plasma.emit(c, callback)
    })
    this.plasma.on(dna.transportChemicalsShape, this.transportChemical, this)
    if (dna.emitReady) {
      this.io.on('connect', () => {
        plasma.emit({type: dna.emitReady})
      })
    }
    if (dna.storeIO) {
      plasma.store({type: dna.storeIO, io: this.io})
    }
  }

  transportChemical (c, callback) {
    if (c[this.idMarker]) return
    this.io.emit('chemical', c, callback)
  }
}
