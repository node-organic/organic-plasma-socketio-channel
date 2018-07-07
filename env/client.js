const io = require('socket.io-client')

module.exports = class SocketIOClientChannel {
  constructor (plasma, dna) {
    this.idMarker = Math.random()
    this.plasma = plasma
    this.dna = dna
    this.io = io(`http://localhost:${dna.port}`, {
      transports: ['websocket']
    })
    this.io.on('chemical', (c, callback) => {
      Object.defineProperty(c, this.idMarker, {enumerable: false, value: true})
      this.plasma.emit(c, callback)
    })
    this.plasma.on(dna.transportChemicalsShape, this.transportChemical, this)
  }

  transportChemical (c, callback) {
    if (c[this.idMarker]) return
    this.io.emit('chemical', c, callback)
  }
}
