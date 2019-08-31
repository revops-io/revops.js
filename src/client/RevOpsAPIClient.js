import superagent from 'superagent'

const REVOPS_HTTP_URL = 'https://tnt6ryfiprp.SANDBOX.verygoodproxy.com'

export class RevOpsAPIClient {
  url = REVOPS_HTTP_URL

  constructor(url = false) {
    if(url && url.length > 0) {
      this.url = url
    }
  }

  createURL(path) {
    if(path && path.startsWith('/') !== true) {
      return this.url + '/' + path
    }
  }

  get(path, query = {}, onError = false, onSuccess = false) {
    const url = this.createURL(path)
    superagent.get(url)
    .query(query)
    .end((err, res) => {
      if (err) {
        if(onError !== false && type(onError) === 'function') {
          onError(err)
        }

        return {
          err,
          status: 'error'
        }
      }

      if(onSuccess !== false && type(onSuccess) === 'function') {
        onSuccess(res)
      }

      return {
        err: false,
        result: res,
        status: 'ok',
      }
    })
  }
}

export default RevOpsAPIClient
