import { EventEmitter } from "excalibur";
import { ActorEvents } from "excalibur/build/dist/Actor";

export interface CustomActorEventBus extends ActorEvents {
  spawnEnemies: { spawnCount: number };
}

export const ActorSignals = new EventEmitter<CustomActorEventBus>();

// publisher
/*
Signals.emit("myEvent", { health: 0 }); // works, and event name shows in intellisense
*/

// subscriber
/*
Signals.on("myEvent", data => {
  console.log("myEvent", data);
});
*/
