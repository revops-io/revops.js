import PropTypes from 'prop-types'

class RevOpsError {

}

RevOpsError.propTypes = {
  status: PropTypes.number,
  response: PropTypes.shape({
     http_status: PropTypes.number,
     message: PropTypes.string,
  }),
}
