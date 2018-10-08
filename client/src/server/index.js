import { get } from '../utils/requests'

export const getAuth = () => get('/auth/user')
export const logout = () => get('/auth/logout')
export const getContacts = () => get('/users')
