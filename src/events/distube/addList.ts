import { Events, Playlist, Queue } from "distube";
import { DisTubeEvent, type Metadata } from "../../types";
import { buildEmbed } from "../../utils";

export default class AddListEvent extends DisTubeEvent<Events.ADD_LIST> {
  readonly name = Events.ADD_LIST;
  run(_queue: Queue, playlist: Playlist<Metadata>) {
    playlist.metadata?.message?.reply(buildEmbed({
      title: "Playlist",
      description: `Add Playlist \n[${playlist.name}](${playlist.url}) \nTotal : (${playlist.songs.length} songs) \`[${playlist.formattedDuration}]\``,
      color: "Blurple",
      footer: {
        text: `Requested by ${playlist.metadata?.message?.author.globalName}`,
        iconURL: playlist.metadata?.message?.author.displayAvatarURL()
      }
    }));
  }
}