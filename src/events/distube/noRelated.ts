import { EmbedBuilder } from "discord.js";
import { DisTubeError, Events, Queue } from "distube";
import { DisTubeEvent } from "../../types";

export default class NoRelatedEvent extends DisTubeEvent<Events.NO_RELATED> {
  readonly name = Events.NO_RELATED;
  run(queue: Queue, error: DisTubeError) {
    queue.textChannel?.send({
      embeds: [new EmbedBuilder().setColor("Red").setTitle("No Related").setDescription(error.message)],
    });
    this.client.log.error(error.message);
  }
}