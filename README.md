# organic-plasma-socketio-channel

A cross browser <-> server two-way channel based on socketio

## usage

### 0) server-side pre-requirements

* [organic-socketio-server](https://github.com/node-organic/organic-socketio-server)

### 1) dna
#### browser

```dna
{
  
  "source": "organic-plasma-socketio-channel/env/client",
  "port": "@cell-ports.server",
  "transportChemicalsShape": {
    "transportType": "socketio"
  }
}
```

#### server

```dna
{
  "source": "organic-plasma-socketio-channel",
  "reactOnConnection": "SocketIOConnection",
  "transportChemicalsShape": {
    "transportType": "socketio"
  }
}
```

### 2) code

```javasciprt
// server-side
plasma.emit({
  type: 'MyChemical',
  transportType: 'socketio',
  value: 'myValue'
})

// client-side
plasma.on('MyChemical', (c) => {
  console.log(c.value) // 'myValue'
})

// and vise-versa
```
