import { Events } from "discord.js";
import { logger } from "../../utils";

export const name = Events.Error
export const run = (error: Error) => {
  return function () {
    const log = logger.scope('discord error')
    log.error(error)
  }
}