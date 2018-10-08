import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Motion, spring } from 'react-motion'
import {
  Avatar,
  List as MList,
  ListItem as MListItem,
  ListItemText,
  withStyles,
  RootRef,
  Tooltip,
} from '@material-ui/core'
import * as R from 'ramda'

const getUserPhoto = (contact) => {
  const photoSrc = R.path([ 'photos', 0, 'value' ], contact)
  return contact && photoSrc
}

const styles = {
  currentUser: {
    textAlign: 'right',
    '&>*:nth-child(1)': {
      order: 2,
    },
    '&>*:nth-child(2)': {
      order: 1,
    },
  },
  secondary: {
    fontSize: 13,
  },
  primary: {
    fontSize: 14,
  },
}

export class List extends Component {
  static propTypes = {
    messages: PropTypes.array,
    render: PropTypes.func,
  }

  componentDidUpdate (prevProps, prevState) {
    const { messages } = this.props
    const domEl = this.ref.current
    if (
      (prevProps.messages.length !== messages.length) && domEl
    ) {
      domEl.scrollTop = domEl.scrollHeight - domEl.offsetHeight
    }
  }

  ref = React.createRef()

  render () {
    const { messages, render, ...rest } = this.props
    return (
      <RootRef rootRef={this.ref}>
        <MList {...rest}>{messages.map(render)}</MList>
      </RootRef>
    )
  }
}

export const ListItem = withStyles(styles)(
  ({ message, date, author, classes, hasCurrentUser }) => (

    <Motion defaultStyle={{ fade: 0 }} style={{ fade: spring(1) }}>
      {({ fade }) => (
        <Tooltip title={date} placement='right'>
          <MListItem
            style={{ opacity: fade }}
            className={classNames({
              [ classes.item ]: true,
              [ classes.currentUser ]: hasCurrentUser,
            })}
          >
            <Avatar srcSet={getUserPhoto(author)}/>
            <ListItemText
              inset={true}
              primary={author.name}
              secondary={message}
              classes={{
                secondary: classes.secondary,
                primary: classes.primary,
              }}/>
          </MListItem>
        </Tooltip>
      )}
    </Motion>
  ),
)
ListItem.propTypes = {
  message: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
}

export default {
  List,
  ListItem,
}
