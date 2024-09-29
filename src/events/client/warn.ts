import { Events, } from "discord.js";
import { logger } from "../../utils";

export const name = Events.Warn
export const run = (warn: any) => {
  return function () {
    const log = logger.scope('discord warn')
    log.warn(warn)
  }
}