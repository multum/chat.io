import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { Button, Avatar, Chip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import * as i18n from '../../constants/i18n'
import centerWindow from '../../utils/centerWindow'
import { ofServer } from '../../utils/server'

const styles = {
  chip: {
    backgroundColor: 'rgba(255,255,255,.5)',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,.8)',
    },
  },
  login: {
    color: '#fff',
  },
}

class Auth extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    getAuth: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
  }

  componentDidMount () {
    this.props.getAuth()
  }

  componentWillUnmount () {
    window.removeEventListener('message', this.onLogin)
  }

  isAuthenticated () {
    const { auth } = this.props
    return auth && auth.user
  }

  onLogout = () =>
    this.props.logout()

  onUserClick = () => {
    const googleID = R.path([ 'auth', 'user', 'googleID' ], this.props)
    window.open(`https://plus.google.com/${googleID}`, '_blank')
  }

  getUserInfo () {
    const { auth, classes } = this.props
    const photoSrc = R.path([ 'user', 'photos', 0, 'value' ], auth)
    const name = R.path([ 'user', 'name' ], auth)
    return (
      <Chip
        avatar={(
          <Avatar
            srcSet={photoSrc}
            alt={name}/>
        )}
        label={name}
        onDelete={this.onLogout}
        onClick={this.onUserClick}
        className={classes.chip}
      />
    )
  }

  getLoginButton () {
    const { classes } = this.props
    return (
      <Fragment>
        <Button
          color='primary'
          className={classes.login}
          onClick={this.handleLogin}
        >{i18n.LOGIN}</Button>
      </Fragment>
    )
  }

  onLogin = (message) => {
    const { data } = message
    if (data) {
      this.props.getAuth()
    }
    window.removeEventListener('message', this.onLogin)
  }

  handleLogin = () => {
    centerWindow(ofServer('/auth'), {
      name: 'loginWindow',
      width: 400,
      height: 500,
    })
    window.addEventListener('message', this.onLogin)
  }

  render () {
    const isAuthenticated = this.isAuthenticated()
    return (
      isAuthenticated
        ? this.getUserInfo()
        : this.getLoginButton()
    )
  }
}

export default withStyles(styles)(Auth)
