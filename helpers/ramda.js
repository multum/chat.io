const R = require('ramda')

module.exports = {
  get: R.curry((path, target) => R.path(path.split('.'), target)),
}
