import { Events, Queue, Song } from "distube"
import { DisTubeEvent, type Metadata } from "../../types"
import { EmbedBuilder } from "discord.js"


export default class ErrorEvent extends DisTubeEvent<Events.ERROR> {
  readonly name = Events.ERROR;
  async run(error: Error, queue: Queue, song?: Song<Metadata>) {
    const embed = new EmbedBuilder().setColor("Red").setTitle("Error").setDescription(`An error encountered: \`${error.message}\``);
    if (song) {
      song.metadata?.message?.edit({ embeds: [embed] });
    } else {
      queue.textChannel?.send({ embeds: [embed] });
    }
    this.client.log.error(error);
  }
}