'use strict';

const Cacheman = require('@kensingtontech/recacheman');

const noop = () => {};

class GooseCache {

  constructor(mongoose, options = {}) {
    if (typeof mongoose.Model.hydrate !== 'function') {
      throw new Error('Cachegoose is only compatible with versions of mongoose that implement the `model.hydrate` method');
    }

    if (this.hasRun) {
      return;
    }

    this.options = options;

    this.hasRun = true;

    this.cache = new Cacheman(null, options);

    require('./extend-query')(mongoose, this);

    require('./extend-aggregate')(mongoose, this);
  }



  clearCache(customKey, cb = noop) {
    if (!customKey) {
      console.log('recachegoose.clearCache(): clearing entire cache');
      this.clear(cb);
      return;
    }

    console.log('recachegoose.clearCache(): clearing cache for key', customKey);
    this.del(customKey, cb);
  }



  async clearCache(customKey) {
    return new Promise( (resolve, reject) => {
      if (!customKey) {
        console.log('recachegoose.clearCache(): clearing entire cache');
        this.clear( () => {
          return resolve();
        });
      }
      else {
        console.log('recachegoose.clearCache(): clearing cache for key', customKey);
        this.del(customKey, () => {
          return resolve();
        });
      }

    });
  }



  get(key, cb = noop) {
    return this.cache.get(key, cb);
  }



  async get(key) {
    return new Promise( (resolve, reject) => {
      this.cache.get(key, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }



  set(key, value, ttl, cb = noop) {
    if (ttl === 0) ttl = -1;
    return this.cache.set(key, value, ttl, cb);
  };



  async set(key, value, ttl) {
    if (ttl === 0) ttl = -1;
    return new Promise( (resolve, reject) => {
      this.cache.set(key, value, ttl, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  };



  evalSha(...args) {
    // cb must be provided as final argument
    if (this.cache.options.engine === 'redis') {
      const redis = this.cache._engine.client;
      return redis.evalsha(...args);
    }
    throw new Error('Engine is not redis');
  }



  del(key, cb = noop) {
    return this.cache.del(key, cb);
  };



  clear(cb = noop) {
    return this.cache.clear(cb);
  }



  get redis() {
    if (this.options.engine === 'redis') {
      return this.cache._engine.client;
    }
    throw new Error('Engine is not redis');
  }

}

module.exports = {
  GooseCache,
  default: GooseCache
};
