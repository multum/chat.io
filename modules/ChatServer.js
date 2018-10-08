const R = require('ramda')
const mongoose = require('mongoose')
const { User } = require('../db/models/user')
const { Room } = require('../db/models/room')
const { get } = require('../helpers/ramda')

const toObjectId = R.map(mongoose.Types.ObjectId)

class ChatServer {
  constructor (params) {
    this.online = []
    this.params = params
    this.io = params.io
  }

  setup () {
    this.io.on('connection', (socket) => {
      socket
        .on('userConnect', (id) => this.handleConnect(socket, id))
        .on('disconnect', () => this.handleDisconnect(socket))
        .on('message', (msg) => this.handleMessage(socket, msg))
        .on('createRoom', ({ name, members }) => this.handleCreateRoom(socket, name, members))
    })
    return this
  }

  getCurrentUser (socket) {
    return this.online.find(R.propEq('socket', socket))
  }

  async handleCreateRoom (socket, name, members) {
    const author = get('user.id', this.getCurrentUser(socket))
    const withAuthor = author ? [ ...members, author ] : members
    const memberIDs = toObjectId(withAuthor)
    const users = await User.find({ _id: { $in: memberIDs } })
    const room = await Room.create({ users, name, members: users.map(R.prop('_id')) })
    console.info(`(room: ${room.id}) created`)

    socket.emit('createRoom', true)
  }

  async handleMessage (socket, msg) {
    const author = await User.findById(msg.author)
    const response = R.evolve({
      author: R.always(author.toClient()),
      date: R.assoc('date', new Date().toISOString()),
    }, msg)

    this.io.emit('message', response)
  }

  async handleConnect (socket, id) {
    const user = id && await User.findById(id)
    this.online.push({ user, socket })
    console.info(`(name: ${user.name} / id: ${user.id}) connected`)
  }

  handleDisconnect (socket) {
    const current = this.getCurrentUser(socket)

    if (current) {
      console.info(get('user.name', current) + ' disconnected')
      this.online.filter((user) => user.socket !== socket)
    }
  }
}

module.exports = ChatServer
