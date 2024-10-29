// main.ts
import "./style.css";

import { UI } from "@peasy-lib/peasy-ui";
import { Engine, DisplayMode, Vector } from "excalibur";
import { model, template } from "./UI/UI";
import { loader } from "./resources";
import { Player } from "./Actors/player";
import { Bug } from "./Actors/bug";
import { SpawnPoint } from "./Actors/spawnPoint";

await UI.create(document.body, model, template).attached;

const game = new Engine({
  width: 800, // the width of the canvas
  height: 600, // the height of the canvas
  canvasElementId: "cnv", // the DOM canvas element ID, if you are providing your own
  displayMode: DisplayMode.Fixed, // the display mode
  pixelArt: true,
});

await game.start(loader);

export let player = new Player(new Vector(225, 200));
game.add(player);

game.currentScene.camera.zoom = 2;

let spawnpoint = new SpawnPoint(new Vector(550, 300));
game.add(spawnpoint);
