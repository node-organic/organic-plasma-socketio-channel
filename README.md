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
  "port": Number,
  "endpoint": String
  "transportChemicalsShape": Object
}
```

* providing `port` will instruct socketio-channel to be connected at `localhost:${port}`
* providing `endpoint` (overrides port) will instruct socketio-channel to connect at given endpoint, example `http://localhost:1337`
* `transportChemicalsShape` will be used to do a deep equal match towards all chemicals emitted in plasma and those matching will be transported via the socketio channel

#### server

```dna
{
  "source": "organic-plasma-socketio-channel",
  "reactOnConnection": String,
  "socketPropertyName": "socket",
  "transportChemicalsShape": Object
}
```

* `transportChemicalsShape` will be used to do a deep equal match towards all chemicals emitted in plasma and those matching will be transported via the socketio channel
* `reactOnConnection` indicates the type of chemical to react on which contains a reference to socketio socket instance. See [organic-socketio-server](https://github.com/node-organic/organic-socketio-server)
* `socketPropertyName` indicates the name of the property within `reactOnConnection` chemical holding reference to socketio socket instance. Defaults to `socket`. See [organic-socketio-server](https://github.com/node-organic/organic-socketio-server)

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
