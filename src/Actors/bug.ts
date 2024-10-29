import { ActionCompleteEvent, Actor, Collider, CollisionContact, CollisionType, Engine, Random, Side, Vector } from "excalibur";
import { bugAnimation, bugSS } from "../resources";
import { player } from "../main";
import { Player } from "./player";
import { NoisyMeet } from "../Lib/NoisyMeet";
import { BehaviorNode, BehaviorStatus, BehaviorTree, RootNode, SelectorNode } from "../Lib/behaviorTree";

export class Bug extends Actor {
  BT: BehaviorTree;
  constructor(pos: Vector) {
    super({
      pos,
      width: 16,
      height: 16,
      radius: 8,
      collisionType: CollisionType.Passive,
    });
    this.graphics.use(bugAnimation);
    this.BT = new BehaviorTree({
      owner: this,
      root: new BugRoot(this),
    });
    this.addComponent(this.BT);
  }

  onInitialize(engine: Engine): void {
    /* this.actions.runAction(new Meet(this, player, 20));
    this.rotation = getAngleToPlayer(this.pos, player.pos) + Math.PI / 2; */
  }

  onCollisionStart(self: Collider, other: Collider, side: Side, contact: CollisionContact): void {
    if (other.owner instanceof Player) {
      this.kill();
    }
  }
}

class BugRoot extends RootNode {
  state = {
    firstTimeFlag: true,
    playerDetected: false,
  };
  constructor(public owner: Actor) {
    super(owner);

    this.addChild(new BugEntry(this.owner, this.state));
    this.addChild(new BugPatrol(this.owner, this.state));
    this.addChild(new BugAttack(this.owner, this.state));
  }
}

class BugAttack extends BehaviorNode {
  constructor(public owner: Actor, public state: any) {
    super(owner);
  }
  preCondition: () => boolean = () => {
    if (this.state.playerDetected && !this.state.firstTimeFlag) return true;
    return false;
  };
  update(engine: Engine, delta: number): BehaviorStatus {
    if (this.isInterrupted) {
      this.isInterrupted = false;
      this.owner.actions.clearActions();
      return BehaviorStatus.Failure;
    }
    //console.log(this.owner, "is attacking");

    this.owner.actions.runAction(new NoisyMeet(this.owner, player, 25));
    this.owner.on("actioncomplete", () => {
      return BehaviorStatus.Success;
    });

    return BehaviorStatus.Running;
  }
}

class BugPatrol extends BehaviorNode {
  status: "free" | "busy" = "free";
  rng = new Random();
  constructor(public owner: Actor, public state: any) {
    super(owner);
  }
  preCondition: () => boolean = () => {
    if (this.state.playerDetected || this.state.firstTimeFlag) return false;
    return true;
  };
  update(engine: Engine, delta: number): BehaviorStatus {
    //move to random spot
    if (this.isInterrupted) {
      this.isInterrupted = false;
      this.status = "free";
      return BehaviorStatus.Failure;
    }
    if (this.status == "busy") return BehaviorStatus.Running;
    let newSpot = this.owner.pos.add(new Vector(this.rng.integer(-25, 25), this.rng.integer(-25, 25)));
    //console.log(this.owner, "is patrolling");
    this.owner.actions.moveTo(newSpot, 25);
    this.status = "busy";
    this.owner.on("actioncomplete", () => {
      //look for player
      let distance = this.owner.pos.distance(player.pos);
      // console.log("distance", distance);
      this.status = "free";
      if (distance < 300) this.state.playerDetected = true;
      return BehaviorStatus.Success;
    });

    return BehaviorStatus.Running;
  }
}

class BugEntry extends BehaviorNode {
  rng = new Random();
  status: "free" | "busy" = "free";
  constructor(public owner: Actor, public state: any) {
    super(owner);
  }
  preCondition: () => boolean = () => {
    if (this.state.firstTimeFlag) return true;
    return false;
  };

  update(engine: Engine, delta: number): BehaviorStatus {
    if (this.isInterrupted) {
      this.isInterrupted = false;
      this.state.firstTimeFlag = false;
      this.status = "free";
      return BehaviorStatus.Failure;
    }
    if (this.status == "busy") return BehaviorStatus.Running;
    let newSpot = new Vector(this.owner.pos.x - 150, this.owner.pos.y + this.rng.integer(-10, 10));
    //console.log(this.owner, "is entering");
    this.owner.actions.moveTo(newSpot, 25);
    this.status = "busy";
    this.owner.on("actioncomplete", () => {
      //look for player
      this.status = "free";
      this.state.firstTimeFlag = false;
      return BehaviorStatus.Success;
    });
    return BehaviorStatus.Running;
  }
}
