import { Events } from "distube";
import { DisTubeEvent } from "../../types";
import config from "../../../config.json";
import { Signale } from "signale";

export default class FFmpegDebugEvent extends DisTubeEvent<Events.FFMPEG_DEBUG> {
  readonly name = Events.FFMPEG_DEBUG;
  run(message: string) {
    const log = new Signale({ scope: "ffmpeg" });
    if (!config.debug) return;
    log.debug(`FFmpeg: ${message}`);
  }
}