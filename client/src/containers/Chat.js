import { connect } from 'react-redux'
import React from 'react'
import Chat from '../components/Chat'
import { getContacts } from '../actions/app'

const ChatContainer = (props) => {
  const { auth: { user } } = props
  return (user && user.id) ? <Chat {...props}/> : null
}

const mapStateToProps = ({ auth, app }) => ({
  auth,
  app,
})

export default connect(mapStateToProps, { getContacts })(ChatContainer)
