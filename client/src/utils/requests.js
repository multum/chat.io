import * as R from 'ramda'
import { isExist } from './ramda'

/**
 *
 * @param {string} url
 * @param option
 * @returns {Promise<*>}
 * @private
 */
async function createRequest ({ url, method = 'GET' }) {
  const response = await fetch(url, {
    method,
  })
  switch (response.status) {
    case 200:
    case 201:
    case 202: {
      if (response.headers.get('content-type').slice(0, 16) === 'application/json') {
        return response.json()
      }
      return response.text()
    }
    default: {
      if (response.headers.get('content-type').slice(0, 16) === 'application/json') {
        throw await response.json()
      }
      throw new Error('Сервер не доступний!')
    }
  }
}

export const get = (url, params) =>
  createRequest({ url: url + getQuery(params) })

/**
 * @param {Object} object with promises
 * @example
 * // returns {data: { contacts: [...contacts] }}
 * promiseByObject({ contacts: get('/contacts')});
 * @returns {Promise<object>}
 */
export const promiseByObject = async (object) => {
  const filtered = R.filter(isExist, object)
  const keys = Object.keys(filtered)
  const promises = keys.map((key) => object[ key ])
  const result = await Promise.all(promises)
  return {
    data: {
      message: result.reduce((acc, response, index) => (
        R.assoc(keys[ index ], response, acc)
      ), {}),
    },
  }
}

const pairsToParam = (item) => `${encodeURIComponent(item[ 0 ])}=${encodeURIComponent(item[ 1 ])}`

export const getQuery = R.ifElse(
  isExist,
  R.compose(
    R.when(R.length, R.concat('?')),
    R.join('&'),
    R.map(pairsToParam),
    R.toPairs,
    R.filter(isExist),
  ),
  R.always(''),
)
