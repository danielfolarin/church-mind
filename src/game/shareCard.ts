// Makes a picture of a finished week for the player to post or send: their
// character, how the week ended, and what they took from it.

export interface WeekCard {
  /** The player's full-body figure, as drawn on the page. */
  figure: SVGSVGElement | null;
  name: string;
  place: string;
  ending: string;
  /** One line per keepsake, e.g. "🪴  A cutting from Dev's fern". */
  keepsakes: string[];
  /** The quality that grew most, if any. */
  grew: string | null;
}

const WIDTH = 1080;
const HEIGHT = 1350;
const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif';
const SANS = 'Inter, -apple-system, "Segoe UI", sans-serif';

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The picture could not be drawn."));
    image.src = source;
  });
}

/** Breaks text into lines that fit, and draws them. Returns the y position after the last line. */
function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, lineHeight: number): number {
  let line = "";
  for (const word of text.split(" ")) {
    const attempt = line ? `${line} ${word}` : word;
    if (ctx.measureText(attempt).width > width && line) {
      ctx.fillText(line, x, y);
      y += lineHeight;
      line = word;
    } else {
      line = attempt;
    }
  }
  if (line) {
    ctx.fillText(line, x, y);
    y += lineHeight;
  }
  return y;
}

async function draw(card: WeekCard): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This device cannot draw the picture.");

  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, "#14110F");
  sky.addColorStop(0.55, "#2A1F2E");
  sky.addColorStop(0.85, "#7C3F4C");
  sky.addColorStop(1, "#E8622C");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = ctx.createRadialGradient(800, 1100, 20, 800, 1100, 520);
  glow.addColorStop(0, "rgba(255, 215, 150, 0.55)");
  glow.addColorStop(1, "rgba(255, 215, 150, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "#14110F";
  ctx.beginPath();
  ctx.moveTo(0, 1230);
  ctx.quadraticCurveTo(360, 1140, 720, 1215);
  ctx.quadraticCurveTo(920, 1255, WIDTH, 1190);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.lineTo(0, HEIGHT);
  ctx.fill();

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#F4EBDD";
  ctx.font = `64px ${SERIF}`;
  ctx.fillText("Church", 80, 150);
  const churchWidth = ctx.measureText("Church ").width;
  ctx.fillStyle = "#E2B36B";
  ctx.fillText("Mind", 80 + churchWidth, 150);

  ctx.fillStyle = "#BFAF9B";
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText(`${card.name.toUpperCase()}’S WEEK IN ${card.place.toUpperCase()}`, 80, 250);

  ctx.fillStyle = "#F4EBDD";
  ctx.font = `76px ${SERIF}`;
  let y = paragraph(ctx, card.ending, 80, 345, 620, 88);

  if (card.grew) {
    ctx.fillStyle = "#E2B36B";
    ctx.font = `italic 38px ${SERIF}`;
    ctx.fillText(`What grew most: ${card.grew.toLowerCase()}`, 80, y + 20);
    y += 80;
  }

  if (card.keepsakes.length) {
    ctx.fillStyle = "#BFAF9B";
    ctx.font = `600 24px ${SANS}`;
    ctx.fillText("KEPT FROM THIS WEEK", 80, y + 40);
    y += 96;
    ctx.fillStyle = "#F4EBDD";
    ctx.font = `34px ${SERIF}`;
    for (const keepsake of card.keepsakes.slice(0, 6)) {
      ctx.fillText(keepsake.length > 34 ? `${keepsake.slice(0, 33)}…` : keepsake, 80, y);
      y += 56;
    }
  }

  if (card.figure) {
    const copy = card.figure.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", "480");
    copy.setAttribute("height", "900");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml" }));
    try {
      ctx.drawImage(await loadImage(url), 610, 330, 480, 900);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  ctx.fillStyle = "#F4EBDD";
  ctx.font = `italic 34px ${SERIF}`;
  ctx.fillText("See life through the way of Jesus.", 80, 1290);
  ctx.fillStyle = "#E2B36B";
  ctx.font = `600 26px ${SANS}`;
  ctx.textAlign = "right";
  ctx.fillText(window.location.host, WIDTH - 80, 1290);
  ctx.textAlign = "left";
  return canvas;
}

/** Draws the card, then hands it to the device's share sheet, or saves it as a file. */
export async function shareWeekCard(card: WeekCard): Promise<void> {
  const canvas = await draw(card);
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("The picture could not be saved."))), "image/png"));
  const file = new File([blob], "my-week-in-church-mind.png", { type: "image/png" });

  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Church Mind", text: `My week in ${card.place}. Play yours: ${window.location.origin}` });
      return;
    } catch (error) {
      // Closing the share sheet is not a failure; anything else falls back to saving.
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = file.name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 4000);
}
