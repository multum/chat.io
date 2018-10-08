import { START, SUCCESS, FAIL, GET_AUTH, LOGOUT } from '../constants/actions'

const initialState = {
  user: null,
  loading: false,
  loaded: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTH + START:
    case LOGOUT + START :
      return {
        ...state,
        loading: true,
      }
    case GET_AUTH + SUCCESS :
      return {
        ...state,
        user: action.payload,
        error: null,
        loading: false,
        loaded: true,
      }
    case GET_AUTH + FAIL :
      return {
        ...state,
        error: action.error,
        user: null,
        loading: false,
      }
    case LOGOUT + SUCCESS :
      return {
        ...state,
        error: null,
        user: null,
        loading: false,
        loaded: false,
      }
    case LOGOUT + FAIL :
      return {
        ...state,
        error: action.error,
        loading: false,
      }
    default:
      return state
  }
}
