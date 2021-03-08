export default class EntityDate {
  private _date: Date
  constructor() {
    this._date = new Date()
  }

  toIsoString() {
    const tzo = -this._date.getTimezoneOffset()
    const dif = tzo >= 0 ? "+" : "-"
    const pad = function (num) {
      const norm = Math.floor(Math.abs(num))
      return (norm < 10 ? "0" : "") + norm
    }
    return (
      this._date.getFullYear() +
      "-" +
      pad(this._date.getMonth() + 1) +
      "-" +
      pad(this._date.getDate()) +
      "T" +
      pad(this._date.getHours()) +
      ":" +
      pad(this._date.getMinutes()) +
      ":" +
      pad(this._date.getSeconds()) +
      dif +
      pad(tzo / 60) +
      ":" +
      pad(tzo % 60)
    )
  }
}
