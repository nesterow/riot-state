module.exports.getInitial = function(name) {
  if (typeof document !== "undefined")
    return (document.__GLOBAL_SHARED_STATE || {})[name];
};

module.exports.createStore = function({ name, state, actions }) {
  let _state = state;

  const saveCopy = () => {
    if (typeof document !== 'undefined') {
      document.__GLOBAL_SHARED_STATE = document.__GLOBAL_SHARED_STATE || {};
      document.__GLOBAL_SHARED_STATE[name] = _state;
    }
  };

  let subscribtions = {};
  const subscribe = (prop, cb) => {
    subscribtions[prop] = subscribtions[prop] || [];
    if (!subscribtions[prop].includes(cb)) subscribtions[prop].push(cb);
  };

  const install = component => {
    (component.shared || []).forEach(e => {
      if (component [e]) {
        return console.warn(`[Store: ${name}] Property ${e} belongs to another store or component scope`)
      } 
      Object.defineProperty(component, e, {
        get() {
          return _state[e];
        }
      });
      subscribe(e, () => {
        component.update();
      });
    });
    if (typeof document !== 'undefined') {
      document.__GLOBAL_STORES = document.__GLOBAL_STORES || {};
      document.__GLOBAL_STORES[name] = {
        reset,
        state: _state,
        dispatch,
        subscribe,
        install
      };
    }
  };

  const dispatch = function(action) {
    const Stores = typeof document !== 'undefined' ? document.__GLOBAL_STORES : {}
    const ctx = {
      Stores,
    };
    Object.keys(state).forEach(element => {
      Object.defineProperty(ctx, element, {
        get: function() {
          return state[element];
        },
        set: function(v) {
          state[element] = v;
          (subscribtions[element] || []).map(function(cb) {
            return cb();
          });
        }
      });
    });

    const result = actions[action].apply(ctx, Array.from(arguments).slice(1));
    if (result && typeof result === "object" && result.then) {
      return result.then(saveCopy);
    } else {
      saveCopy();
      return result;
    }
  };

  const reset = () => {
    subscribtions = {}
  }

  return {
    reset,
    state: _state,
    dispatch,
    subscribe,
    install
  };
};
