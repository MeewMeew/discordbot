import { DisTubeError, Events, Queue } from "distube";
import { DisTubeEvent } from "../../types";
import { buildEmbed } from "../../utils";

export default class NoRelatedEvent extends DisTubeEvent<Events.NO_RELATED> {
  readonly name = Events.NO_RELATED;
  run(queue: Queue, error: DisTubeError) {
    queue.textChannel?.send(buildEmbed({
      title: "No Related",
      description: error.message,
      color: "Red"
    }));
    this.client.log.error(error.message);
  }
}