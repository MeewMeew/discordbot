import { Events, Queue, Song } from "distube"
import { DisTubeEvent, type Metadata } from "../../types"
import { buildEmbeds } from "../../utils";


export default class ErrorEvent extends DisTubeEvent<Events.ERROR> {
  readonly name = Events.ERROR;
  async run(error: Error, queue: Queue, song?: Song<Metadata>) {
    const embed = buildEmbeds([
      {
        title: "Error",
        description: `An error encountered: \`${error.message}\``,
        color: "Red"
      }
    ]);
    if (song) {
      song.metadata?.message?.reply(embed);
    } else {
      queue.textChannel?.send(embed);
    }
    this.client.log.error(error);
  }
}