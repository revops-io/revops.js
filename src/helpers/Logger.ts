export const LoggingLevels = {
  Warn: "warn",
  Info: "info",
  Error: "error",
}

// extraInfo allows for passing an object to be printed to the console
export const logInfo = (msg: string, loggingLevel = "", extraInfo = "") => {
  if (loggingLevel === LoggingLevels.Info) {
    console.log(msg, extraInfo)
  }
}

export const logWarning = (msg: string, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Error
  ) {
    console.warn(msg, extraInfo)
  }
}

export const logError = (msg: string, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Error
  ) {
    console.error(msg, extraInfo)
  }
}
