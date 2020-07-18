module.exports = class SocketIOServerChannel {
  constructor (plasma, dna) {
    this.idMarker = Math.random()
    this.plasma = plasma
    this.dna = dna
    this.sockets = []
    this.plasma.on(dna.reactOnConnection, this.handleConnection, this)
    this.plasma.on(dna.transportChemicalsShape, this.transportChemical, this)
    if (dna.log) console.info('pipe plasma chemicals via socketio', dna.transportChemicalsShape)
  }

  handleConnection (c) {
    let socket = c[this.dna.socketPropertyName || 'socket']
    this.sockets.push(socket)
    socket.on('chemical', (c) => {
      Object.defineProperty(c, this.idMarker, {enumerable: false, value: true})
      this.plasma.emit(c)
    })
    socket.on('disconnect', () => {
      this.sockets.splice(this.sockets.indexOf(socket), 1)
    })
  }

  transportChemical (c) {
    if (c[this.idMarker]) return
    this.sockets.forEach(socket => {
      socket.emit('chemical', c)
    })
  }
}
