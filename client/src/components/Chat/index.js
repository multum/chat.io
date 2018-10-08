import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import io from 'socket.io-client'
import moment from 'moment'
import {
  TextField,
  withStyles,
  Grid,
  IconButton,
} from '@material-ui/core'
import { Send } from '@material-ui/icons'
import * as i18n from '../../constants/i18n'
import * as sEvents from '../../constants/socketEvents'
import Message from './Message'

const styles = {
  textField: {
    flexGrow: 1,
    margin: '10px 5px 10px 0',
  },
  container: {
    width: 900,
    maxWidth: '100%',
    margin: '20px auto',
    flexGrow: 1,
  },
  content: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
  fieldContainer: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    flexShrink: 0,
  },
  messages: {
    flexGrow: 1,
    overflow: 'auto',
  },
}

const removeSocketListeners = (socket) => {
  socket
    .removeListener(sEvents.MESSAGE)
    .removeListener(sEvents.CREATE_ROOM)
  console.info('Removed socket listeners')
}

class Chat extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    getContacts: PropTypes.func.isRequired,
  }

  state = {
    value: '',
    socket: false,
    messages: [],
  }

  componentDidMount () {
    const socket = io()
    socket.on('connect', () => this.handleSocketConnect(socket))
    socket.on('disconnect', () => removeSocketListeners(socket))
  }

  componentWillUnmount () {
    this.state.socket.disconnect()
    this.state.socket.disconnect()
  }

  handleSocketConnect = (socket) => {
    const { auth, getContacts } = this.props
    this.setState({ socket })
    this.handleSocketEvents(socket)
    getContacts()
    socket.emit(sEvents.USER_CONNECT, auth.user.id)
  }

  handleSocketEvents (socket) {
    socket.on(sEvents.MESSAGE, (msg) => {
      this.setState((state) => ({
        messages: [ ...state.messages, msg ],
      }))
    })
    socket.on(sEvents.CREATE_ROOM, console.info)
  }

  getContact (id) {
    const { app: { contacts } } = this.props
    return contacts.find(R.propEq('id', id))
  }

  isConnected () {
    const { socket } = this.state
    return socket && socket.connected
  }

  valueIsFilled () {
    const { value } = this.state
    if (value) {
      return value.trim().length
    }
  }

  getControls (isConnected) {
    const enabled = isConnected && this.valueIsFilled()
    return <Fragment>
      <IconButton onClick={this.sendMessage} disabled={!enabled}>
        <Send/>
      </IconButton>
    </Fragment>
    /** <IconButton onClick={this.handleCreateRoom} disabled={!isConnected}>
     <Create/>
     </IconButton>
     <IconButton onClick={this.handleShowContacts} disabled={!isConnected}>
     <Create/>
     </IconButton>
     **/
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    })
  }

  sendMessage = () => {
    const { socket, value } = this.state
    const { auth: { user } } = this.props
    socket.emit(sEvents.MESSAGE, {
      message: value,
      author: user.id,
    })
    this.setState({ value: null })
    this.field.focus()
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.sendMessage()
    }
  }

  handleCreateRoom = () => {
    this.state.socket.emit(sEvents.CREATE_ROOM, {
      name: 'new Room',
      members: [],
    })
  }

  handleShowContacts = () => {
    console.info(this.props.app.contacts)
  }

  setFieldRef = (node) => (this.field = node)

  render () {
    const { classes, auth: { user } } = this.props
    const { value, messages } = this.state
    const isConnected = this.isConnected()
    return (
      <Grid container spacing={24} className={classes.container}>
        <Grid item xs={12} className={classes.content}>
          <Message.List
            className={classes.messages}
            messages={messages}
            render={({ author, message, date }) => (
              <Message.ListItem
                key={message + date}
                message={message}
                date={moment(date).format('HH:mm:ss DD.MM.YYYY')}
                author={author}
                hasCurrentUser={author.id === user.id}
              />
            )}
          />
          <div className={classes.fieldContainer}>
            <TextField
              multiline={true}
              rowsMax={4}
              label={i18n.TEXT_MESSAGE}
              className={classes.textField}
              value={value || ''}
              onChange={this.handleChange}
              margin='normal'
              variant='outlined'
              disabled={!isConnected}
              inputRef={this.setFieldRef}
              onKeyPress={this.handleEnter}
            />
            {this.getControls(isConnected)}
          </div>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles)(Chat)
