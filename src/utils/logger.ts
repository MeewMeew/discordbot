import { Signale } from "signale";

export const logger = new Signale({
  scope: "global",
  types: {
    error: {
      badge: "!!",
      color: "red",
      label: "error"
    },
    warn: {
      badge: "!!",
      color: "yellow",
      label: "warn"
    },
    info: {
      badge: "i",
      color: "blue",
      label: "info"
    },
    debug: {
      badge: "d",
      color: "magenta",
      label: "debug"
    },
    success: {
      badge: "s",
      color: "green",
      label: "success"
    },
    star: {
      badge: "*",
      color: "yellow",
      label: "star"
    }
  }
});

logger.config({
  displayTimestamp: true,
  displayDate: true,
});

export default logger;