### riot-state

Simplest centralized state management for Riot.JS


```javascript
//store.js
const {createStore} = require('riot-state')

const name = 'example'

const state = {
  text: ''
}

const actions = {
  ping(){
    this.state.name = 'ping'
  },
  pong(){
    this.state.name = 'pong'
  }
};

module.exports = createStore({
  name,
  state,
  actions
})
```

```html
<ping>
  {text}
  <script>
  import store from '/store.js'
  export default {
    shared: [
      'text'
    ],
    onMounted(){
      store.install(this)
    },
    ping(){
      store.dispatch('ping')
    }
  }
  </script>
</ping>
```

```html
<pong>
  {text}
  <script>
  import store from '/store.js'
  export default {
    shared: [
      'text'
    ],
    onMounted(){
      store.install(this)
    },
    pong(){
      store.dispatch('pong')
    }
  }
  </script>
</pong>
```