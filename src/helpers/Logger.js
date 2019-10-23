export const LoggingLevels = {
  Warn: "warn",
  Info: "info",
  Debug: "debug",
}

// extraInfo allows for passing an object to be printed to the console
export const logInfo = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Debug
  ) {
    console.log(msg + extraInfo)
  }
}

export const logWarning = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Debug
  ) {
    console.warn(msg + extraInfo)
  }
}

export const logError = (msg, loggingLevel = "", extraInfo = "") => {
  if (
    loggingLevel === LoggingLevels.Debug
  ) {
    console.error(msg + extraInfo)
  }
}