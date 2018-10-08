import React, { Component } from 'react'
import PropTypes from 'prop-types'
import 'typeface-roboto'
import { withStyles } from '@material-ui/core'
import ChatContainer from './containers/Chat'
import Header from './components/Header'

const styles = {
  root: {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column nowrap',
  },
}

class App extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <Header/>
        <ChatContainer/>
      </div>
    )
  }
}

export default withStyles(styles)(App)
