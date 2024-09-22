import { Events, Queue } from "distube";
import { DisTubeEvent } from "../../types";
import { buildEmbed } from "../../utils";

export default class FinishEvent extends DisTubeEvent<Events.FINISH> {
  readonly name = Events.FINISH;
  run(queue: Queue) {
    queue.textChannel?.send(buildEmbed({
      title: "Queue Finished",
      description: "No more song in the queue",
      color: "Blurple"
    }));
  }
}