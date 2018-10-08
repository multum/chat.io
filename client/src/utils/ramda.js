import * as R from 'ramda'

/**
 * Perform not is nil check
 * @returns {Boolean} Returns flag whether param is exists or not
 */
export const isExist = R.compose(R.not, R.isNil)

/**
 * Perform ramda`s not is empty check
 * @returns {Boolean} Returns flag whether param is empty or not
 */
export const notIsEmpty = R.compose(R.not, R.isEmpty)
/**
 * Pick of keys by paths
 * @param {Object} desc Object with paths
 * @param {Object} object Object for pick paths
 */
export const pickByPaths = R.curry(
  (desc, object) =>
    R.map((path) => R.view(R.lensPath(path), object), desc),
)
