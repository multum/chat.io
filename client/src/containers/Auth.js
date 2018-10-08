import { connect } from 'react-redux'
import Auth from '../components/Auth'
import { getAuth, logout } from '../actions/auth'

const mapStateToProps = ({ auth }) => ({
  auth,
})

const mapDispatchToProps = {
  getAuth,
  logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
