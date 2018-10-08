import { START, SUCCESS, FAIL, GET_CONTACTS } from '../constants/actions'
import * as server from '../server'
import of from '../utils/of'

export const getContacts = () => async (dispatch) => {
  dispatch({
    type: GET_CONTACTS + START,
  })
  const [ response, error ] = await of(server.getContacts())
  if (response) {
    dispatch({
      type: GET_CONTACTS + SUCCESS,
      payload: response.message,
    })
  }
  if (error) {
    dispatch({
      type: GET_CONTACTS + FAIL,
      error,
    })
  }
}
