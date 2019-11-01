export class EntityDate {
  constructor () {
    this._date = new Date()
  }

  toIsoString () {
    var tzo = -this._date.getTimezoneOffset()
    var dif = tzo >= 0 ? '+' : '-'
    var pad = function (num) {
      var norm = Math.floor(Math.abs(num))
      return (norm < 10 ? '0' : '') + norm
    }
    return this._date.getFullYear() +
        '-' + pad(this._date.getMonth() + 1) +
        '-' + pad(this._date.getDate()) +
        'T' + pad(this._date.getHours()) +
        ':' + pad(this._date.getMinutes()) +
        ':' + pad(this._date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60)
  }
}
