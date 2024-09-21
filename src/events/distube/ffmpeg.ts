import { Events } from "distube";
import { DisTubeEvent } from "../../types";
import config from "../../../config.json";

export default class FFmpegDebugEvent extends DisTubeEvent<Events.FFMPEG_DEBUG> {
  readonly name = Events.FFMPEG_DEBUG;
  run(message: string) {
    if (!config.debug) return;
    this.client.log.debug(`FFmpeg: ${message}`);
  }
}