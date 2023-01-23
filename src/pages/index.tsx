import { Game } from "@/core/game";
import { useEffect, useState } from "react";

export default function Home() {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    const shadowCanvas = document.getElementById("game-shadow") as HTMLCanvasElement;

    setGame(Game.getInstance(canvas, shadowCanvas));
  }, []);

  return (
    <>
      <canvas id="game"></canvas>
      <canvas id="game-shadow"></canvas>
    </>
  );
}
