import { Events, Queue } from "distube";
import { DisTubeEvent } from "../../types";

export default class InitQueueEvent extends DisTubeEvent<Events.INIT_QUEUE> {
  readonly name = Events.INIT_QUEUE;
  run(queue: Queue) {
    queue.volume = 50;
  }
}