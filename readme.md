## riot-state

Simplest centralized state management for Riot.JS

[⚙ CodeSandbox Example](https://codesandbox.io/s/goofy-satoshi-dbul6)


## Usage

A riot-state store consists of following properties: `name`, `state`, `actions`. And provides following methods: `dispatch`, `install`

##### Store `name`
Name property is required if initial state would load from a global object.
By default `riot-state` loads initial data from `document.__GLOBAL_SHARED_STATE [name]`

##### State
A **flat** javascript object.

##### Actions
A javascript object containing functions. An action cannot be an `arrow function`


## Component context 
A component has to provide a list of variables that will be injected in component scope.
```javascript
export default {
  shared: ['foo', 'bar']
}
```



## Example:

```javascript
//store.js
import { createStore } from "./state";

const name = "example";

const state = {
  number: 0
};

const actions = {
  increment(value = 1) {
    this.number += value;
  },

  decrement(value = 1) {
    this.number -= value;
  }
};

export default createStore({
  name,
  state,
  actions
});

```

```html
<number>
  <div class="number">
    {number}
  </div>
  <script>
    import store from './store'
    export default ()=> ({
      shared: [
        'number'
      ],
      onMounted(){
        store.install(this)
        this.update()
      },
      onUpdated(){
        console.log(this.number)
      }
    })
  </script>
</number>
```

```html
<controls>
  <button onclick={plus}>+</button>
  <button onclick={minus}>-</button>
  <script>
    import store from './store'
    export default () => ({
      onMounted(){
        store.install(this)
      },
      plus(){
        store.dispatch('increment')
      },
      minus(){
        store.dispatch('decrement')
      },
    })
  </script>
</controls>
```

### License

MIT
