import { Signale } from "signale";
import { Events } from "discord.js";

export const name = Events.Error
export const run = (error: Error) => {
  return function () {
    new Signale({ scope: 'discord error' }).error(error)
  }
}