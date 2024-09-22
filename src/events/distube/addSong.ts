import { Events } from "distube";
import { DisTubeEvent, type Metadata } from '../../types';
import type { Queue, Song } from "distube";
import { buildEmbed } from "../../utils";

export default class AddSongEvent extends DisTubeEvent<Events.ADD_SONG> {
  readonly name = Events.ADD_SONG;
  run(queue: Queue, song: Song<Metadata>) {
    const embed = buildEmbed({
      title: "Song Added",
      description: `Added \`${song.name}\` to the queue`,
      color: "Blurple",
      footer: {
        text: `Requested by ${song.metadata?.message?.author.globalName}`,
        iconURL: song.metadata?.message?.author.displayAvatarURL()!
      }
    })
    if (!song.metadata?.message) {
      queue.textChannel?.send(embed);
    } else {
      song.metadata?.message?.reply(embed);
    }
  }
}