// resources.ts
import { Animation, ImageSource, Loader, Sprite, SpriteSheet, AnimationStrategy } from "excalibur";
import player from "./Assets/player.png";
import bug from "./Assets/bug.png";

export const Resources = {
  player: new ImageSource(player),
  bug: new ImageSource(bug),
};

export const bugSS = SpriteSheet.fromImageSource({
  image: Resources.bug,
  grid: {
    rows: 1,
    columns: 6,
    spriteWidth: 16,
    spriteHeight: 16,
  },
});

export const bugAnimation = new Animation({
  strategy: AnimationStrategy.PingPong,
  frames: [
    {
      graphic: bugSS.getSprite(0, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(1, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(2, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(3, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(4, 0),
      duration: 50,
    },
    {
      graphic: bugSS.getSprite(5, 0),
      duration: 50,
    },
  ],
});

export const loader = new Loader();

for (let res of Object.values(Resources)) {
  loader.addResource(res);
}
