import { GET_AUTH, LOGOUT } from '../constants/actions'
import * as server from '../server'

export const getAuth = () => ({
  promise: server.getAuth(),
  type: GET_AUTH,
})

export const logout = () => ({
  promise: server.logout(),
  type: LOGOUT,
})
