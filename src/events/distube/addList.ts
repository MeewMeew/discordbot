import { Events, Playlist, Queue } from "distube";
import { DisTubeEvent, type Metadata } from "../../types";
import { EmbedBuilder } from "discord.js";

export default class AddListEvent extends DisTubeEvent<Events.ADD_LIST> {
  readonly name = Events.ADD_LIST;
  run(_queue: Queue, playlist: Playlist<Metadata>) {
    playlist.metadata.message.edit({
      embeds: [
        new EmbedBuilder()
          .setColor("Blurple")
          .setTitle("Playlist")
          .setDescription(`Added \`${playlist.name}\` (${playlist.songs.length} songs) to the queue`),
      ],
    });
  }
}