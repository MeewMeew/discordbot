import { Events } from "distube";
import { DisTubeEvent } from "../../types";
import config from "../../../config.json";
import { logger } from "../../utils";

export default class FFmpegDebugEvent extends DisTubeEvent<Events.FFMPEG_DEBUG> {
  readonly name = Events.FFMPEG_DEBUG;
  run(message: string) {
    const log = logger.scope('ffmpeg')
    config.debug && log.debug(`FFmpeg: ${message}`);
  }
}