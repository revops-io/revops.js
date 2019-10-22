export const LoggingLevels = {
  Warn: "warn",
  Info: "info",
  Debug: "debug",
}

export const logInfo = (msg, loggingLevel = "") => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Debug
  ) {
    console.log(msg)
  }
}

export const logWarning = (msg, loggingLevel = "") => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Debug
  ) {
    console.warn(msg)
  }
}

export const logError = (msg, loggingLevel = "", error = false) => {
  if (
    loggingLevel === LoggingLevels.Warn ||
    loggingLevel === LoggingLevels.Info ||
    loggingLevel === LoggingLevels.Debug
  ) {
    console.error(msg + error)
  }
}