import { Events, Queue, Song } from "distube";
import { DisTubeEvent, type Metadata } from "../../types";
import { buildEmbeds } from "../../utils";

export default class PlaySongEvent extends DisTubeEvent<Events.PLAY_SONG> {
  readonly name = Events.PLAY_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    const emded = buildEmbeds([{
      title: "Playing Song",
      description: `Playing: \`${song.name}\``,
      color: "Blurple",
      footer: {
        text: `Requested by ${song.metadata?.message?.author.globalName}`,
        iconURL: song.metadata?.message?.author.displayAvatarURL()!
      }
    }]);
    if (!song.metadata?.message) {
      queue.textChannel?.send(emded);
    } else {
      song.metadata?.textChannel?.send(emded);
    }
  }
}