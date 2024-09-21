import { Signale } from "signale";

export const name = "error"
export const run = (error: Error) => {
  return function () {
    new Signale().error(error)
  }
}