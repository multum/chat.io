import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Toolbar, IconButton, Typography, withStyles } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import AuthContainer from '../../containers/Auth'

const styles = {
  grow: {
    flexGrow: 1,
  },
}

class Header extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render () {
    const { classes } = this.props
    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton color='inherit' aria-label='Menu'>
            <MenuIcon/>
          </IconButton>
          <Typography variant='title' color='inherit'>
            Chat.io
          </Typography>
          <div className={classes.grow}/>
          <AuthContainer/>
        </Toolbar>
      </AppBar>
    )
  }
}

export default withStyles(styles)(Header)
