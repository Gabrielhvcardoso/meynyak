import { Game } from "@/core/game";
import { useEffect, useState } from "react";

export default function Home() {
  const [game, setGame] = useState<Game>();

  useEffect(() => {
    const canvas = document.getElementById("game") as HTMLCanvasElement;
    setGame(Game.getInstance(canvas));
  }, []);

  return (
    <canvas id="game"></canvas>
  );
}
