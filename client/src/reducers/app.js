import { START, SUCCESS, FAIL, GET_CONTACTS } from '../constants/actions'

const initialState = {
  contacts: null,
  error: null,
  loading: true,
  loaded: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_CONTACTS + START :
      return {
        ...state,
        loading: true,
      }
    case GET_CONTACTS + SUCCESS :
      return {
        ...state,
        contacts: action.payload,
        error: null,
        loading: false,
        loaded: true,
      }
    case GET_CONTACTS + FAIL :
      return {
        ...state,
        error: action.error,
        contacts: null,
        loading: false,
      }
    default:
      return state
  }
}
