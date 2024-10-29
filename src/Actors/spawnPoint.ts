import { Actor, Color, Engine, Random, Rectangle, Util, Vector } from "excalibur";
import { ActorSignals } from "../Lib/CustomEmitterManager";
import { Bug } from "./bug";

const spawnBox = new Rectangle({
  width: 16,
  height: 48,
  color: Color.Transparent,
  strokeColor: Color.White,
  lineWidth: 2,
});

export class SpawnPoint extends Actor {
  rng = new Random();
  constructor(pos: Vector) {
    super({
      pos,
      width: 16,
      height: 48,
    });

    this.graphics.use(spawnBox);
  }

  onInitialize(engine: Engine): void {
    ActorSignals.on("spawnEnemies", async data => {
      console.log("spawnEnemies", data);

      for (let i = 0; i < data.spawnCount; i++) {
        engine.currentScene.add(new Bug(this.pos.add(new Vector(0, this.rng.integer(-10, 24)))));
        await Util.delay(1000);
      }
    });
  }
}
