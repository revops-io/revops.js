import axios from 'axios'

const REVOPS_HTTP_URL = 'https://vault.revops.io'
const AUTH_TOKEN = 'slujibu'

export class RevOpsAPIClient {
  url = REVOPS_HTTP_URL

  constructor(url = false) {
    if(url && url.length > 0) {
      this.url = url
    }

    this.request = axios.create({
      baseURL: REVOPS_HTTP_URL
    })
    this.request.defaults.timeout = 100
    this.request.defaults.headers.common['Authorization'] = AUTH_TOKEN
    this.request.defaults.headers.post['Content-Type'] = 'application/json'
    this.request.defaults.headers.get['Content-Type'] = 'application/json'
  }

  createURL(path) {
    if(path && path.startsWith('/') !== true) {
      if(path.startsWith('http') !== true) {
        path = '/' + path
      } else {
        return path
      }
    }

    return this.url + path
  }

  handleResponse(params) {
    return (response) => {
      // handle success
      if(params.onSuccess !== false
        && typeof(params.onSuccess) === 'function') {
        params.onSuccess(response)
      }

      return response
    }
  }

  handleError(params) {
    return (error) => {
      if (axios.isCancel(error)) {
        if(params.onCancel !== false &&
          typeof(params.onCancel) === 'function') {
          params.onCancel(error)
        }
      } else {
        if(params.onError !== false
          && typeof(params.onError) === 'function') {
          params.onError(error)
        }
      }

      return error
    }
  }

  get(path, params = {
    query: {},
    onError: false,
    onSuccess: false,
    onCancel: false,
  }) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const url = this.createURL(path)
    if(params.query !== false &&
      typeof(params.query) === 'object' &&
      Object.values(params.query).length > 0
    ) {
      let queryString = new URLSearchParams(params.query).toString()
      url = url + queryString
    }

    let request = axios.get(url, {
      cancelToken: source.token,
      validateStatus: function (status) {
        return status < 300; // Reject only if the status code is greater than or equal to 500
      }
    })
    .then(this.handleResponse(params))
    .catch(this.handleError(params))

    return {
      source,
      request
    }
  }

  post(path, data = {}, params = {
    query: {},
    onError: false,
    onSuccess: false,
    onCancel: false,
  }) {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const url = this.createURL(path)
    if(params.query !== false &&
      typeof(params.query) === 'object' &&
      Object.values(params.query).length > 0
    ) {
      let queryString = new URLSearchParams(params.query).toString()
      url = url + queryString
    }

    let request = axios.post(url, data, {
      cancelToken: source.token,
      validateStatus: function (status) {
        return status < 300; // Reject only if the status code is greater than or equal to 500
      }
    })
    .then(this.handleResponse(params))
    .catch(this.handleError(params))


    return {
      source,
      request
    }
  }
}

export default RevOpsAPIClient
