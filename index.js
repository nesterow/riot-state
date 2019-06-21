

const observe = require('on-change')

module.exports.getInitial = function(name) {
  if (typeof document !== 'undefined')
    return (document.__GLOBAL_SHARED_STATE || {}) [name]
};

module.exports.createStore = function ({ name, state, actions }){
  
  
  let _state = state
  
  const saveCopy = () => {
    if (typeof document !== 'undefined') {
      document.__GLOBAL_SHARED_STATE = document.__GLOBAL_SHARED_STATE || {}
      document.__GLOBAL_SHARED_STATE [name] =_state
    }
  }

  const subscribtions = {}
  const subscribe = (prop, cb) => {
    subscribtions[prop] = subscribtions[prop] || []
    if (!subscribtions[prop].includes(cb))
      subscribtions[prop].push(cb);
  }

  observe(_state, (path)=>{
    (subscribtions[path] || []).map((cb) => {
      cb()
    })
  })

  const install = (component) => {
    (component.shared || []).map(e => {
      Object.defineProperty(component, e, {
        get(){
          return _state[e]
        }
      })
      subscribe(e, () => {
        component.update()
      })
    })
  }

  const dispatch = function (action){
    const ctx = {
      state: _state,
      actions,
    };
    const result = actions[action].apply(ctx, Array.from(arguments).slice(1))
    if (result && typeof result === 'object' && result.then) {
      return result.then(saveCopy)
    } else {
      saveCopy()
      return result
    }
  }

  return {
    state: _state,
    dispatch,
    subscribe,
    install,
  }

}