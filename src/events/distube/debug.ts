import { Events } from "distube";
import { DisTubeEvent } from "../../types";
import config from "../../../config.json";

export default class DebugEvent extends DisTubeEvent<Events.DEBUG> {
  readonly name = Events.DEBUG;
  run(message: string) {
    if (!config.debug) return;
    this.client.log.debug(message);
  }
}