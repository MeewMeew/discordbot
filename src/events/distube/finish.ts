import { EmbedBuilder } from "discord.js";
import { Events, Queue } from "distube";
import { DisTubeEvent } from "../../types";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;
  run(queue: Queue) {
    queue.textChannel?.send({
      embeds: [new EmbedBuilder().setColor("Blurple").setDescription("Finished!")],
    });
  }
}