import { Signale } from "signale";
import { Events, } from "discord.js";

export const name = Events.Warn
export const run = (warn: any) => {
  return function () {
    new Signale({ scope: 'discord warn' }).warn(warn)
  }
}