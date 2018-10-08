import { FAIL, START, SUCCESS } from '../constants/actions'
import of from '../utils/of'

export const loadingFlags = (store) => (next) => async (action) => {
  const { promise, type } = action
  if (promise) {
    store.dispatch({
      type: type + START,
    })
    const [ response, error ] = await of(promise)
    if (response) {
      store.dispatch({
        type: type + SUCCESS,
        payload: response.message,
      })
    }
    if (error) {
      store.dispatch({
        type: type + FAIL,
        error,
      })
    }
  } else {
    next(action)
  }
}
