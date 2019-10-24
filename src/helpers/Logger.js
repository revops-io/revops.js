export const LoggingLevels = {
  Warn: "warn",
  Info: "info",
  Error: "error",
}

// extraInfo allows for passing an object to be printed to the console
export const logInfo = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Error
  ) {
    console.log(msg + extraInfo)
  }
}

export const logWarning = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Error
  ) {
    console.warn(msg + extraInfo)
  }
}

export const logError = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Error
  ) {
    console.error(msg + extraInfo)
  }
}