import { Actor, CollisionType, Engine, Random, Shape, Vector } from "excalibur";
import { Resources } from "../resources";
import { ActorSignals } from "../Lib/CustomEmitterManager";

let boxCollider = Shape.Capsule(24, 24);

export class Player extends Actor {
  rng = new Random();
  constructor(pos: Vector) {
    super({
      pos,
      width: 24,
      height: 24,
      collider: boxCollider,
      collisionType: CollisionType.Passive,
    });

    this.graphics.use(Resources.player.toSprite());
  }

  onInitialize(engine: Engine): void {
    this.on("pointerdown", () => {
      ActorSignals.emit("spawnEnemies", { spawnCount: this.rng.integer(1, 15) }); //this.rng.integer(1, 8)
    });
    this.vel = new Vector(0, 20);
  }

  onPreUpdate(engine: Engine, delta: number): void {
    //console.log(this.pos.y);

    if (this.pos.y > 400) {
      this.vel = new Vector(0, -20);
    } else if (this.pos.y < 200) {
      this.vel = new Vector(0, 20);
    }
  }
}
