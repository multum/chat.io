import { isNil } from 'ramda'
import { isExist } from './ramda'

/**
 * Returns the promise that will be resolved with an array of signature `[response, error]`
 *
 * @param {Promise} promise Promise that should be called
 */
export default function of (promise) {
  return Promise.resolve(promise)
    .then((response) => {
      if (isExist(response.error)) {
        return [ undefined, response.error ]
      }

      if (isExist(response.data.message)) {
        // Return successfull data
        return [ response.data ]
      } else {
        // Return error if message doesnt exist
        const err = new Error(`Rejection with empty 'response.data.message' value`)
        err.originalValue = err
        return [ undefined, err ]
      }
    })
    .catch((error) => {
      if (isNil(error)) {
        const err = new Error('Rejection with empty value')
        err.originalValue = err
        error = err
      }

      if (isNil(error.error)) {
        return [ undefined, error ]
      }

      return [ undefined, error.error ]
    })
}
