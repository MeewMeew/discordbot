import { Signale } from "signale";

export const signaleConfig = {
  types: {
    error: {
      badge: "!!",
      color: "red",
      label: "error"
    },
    warn: {
      badge: "!",
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
      label: "done"
    },
    star: {
      badge: "*",
      color: "yellow",
      label: "star"
    }
  }
}

export const loggerConfig = {
  displayTimestamp: true,
  displayDate: true,
}

export const logger = new Signale({ ...signaleConfig, scope: 'global' });

logger.config(loggerConfig);

export default logger;