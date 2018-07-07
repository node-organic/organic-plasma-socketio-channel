module.exports = class SocketIOServerChannel {
  constructor (plasma, dna) {
    this.idMarker = Math.random()
    this.plasma = plasma
    this.dna = dna
    this.sockets = []
    this.plasma.on(dna.reactOnConnection, this.handleConnection, this)
    this.plasma.on(dna.transportChemicalsShape, this.transportChemical, this)
  }

  handleConnection (c) {
    this.sockets.push(c[this.dna.socketPropertyName || 'socket'])
    c.socket.on('chemical', (c, callback) => {
      Object.defineProperty(c, this.idMarker, {enumerable: false, value: true})
      this.plasma.emit(c, callback)
    })
    c.socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(c.socket), 1)
    })
  }

  transportChemical (c, callback) {
    if (c[this.idMarker]) return
    this.sockets.forEach(socket => {
      socket.emit('chemical', c, callback)
    })
  }
}
