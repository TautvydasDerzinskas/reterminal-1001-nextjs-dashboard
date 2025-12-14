import { ImageResponse } from 'next/og';
import { PNG } from 'pngjs';
import { fetchDashboardData, generateDashboardJSX, generateErrorJSX } from '../../../lib/dashboard';

export const runtime = 'nodejs';

async function generatePackedBuffer(pngBuffer: ArrayBuffer): Promise<Buffer> {
  const png = PNG.sync.read(Buffer.from(pngBuffer));
  const { width, height, data } = png;
  const packed = Buffer.alloc(width * height / 8);
  const errors = new Array(width * height).fill(0); // Error diffusion array

  let packedIndex = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 8) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const pixelIndex = (y * width + x + bit) * 4;
        const r = data[pixelIndex] + errors[y * width + x + bit];
        const g = data[pixelIndex + 1] + errors[y * width + x + bit];
        const b = data[pixelIndex + 2] + errors[y * width + x + bit];
        const gray = Math.round((r + g + b) / 3);
        const threshold = 128;
        const bitValue = gray > threshold ? 0 : 1; // 0 for white (light), 1 for black (dark)
        byte |= bitValue << (7 - bit);

        // Floyd-Steinberg error diffusion
        const error = gray - (bitValue ? 0 : 255);
        if (x + bit + 1 < width) errors[y * width + x + bit + 1] += error * 7 / 16;
        if (y + 1 < height) {
          if (x + bit > 0) errors[(y + 1) * width + x + bit - 1] += error * 3 / 16;
          errors[(y + 1) * width + x + bit] += error * 5 / 16;
          if (x + bit + 1 < width) errors[(y + 1) * width + x + bit + 1] += error * 1 / 16;
        }
      }
      packed[packedIndex++] = byte;
    }
  }
  return packed;
}

export async function GET(request: Request) {
  try {
    const data = await fetchDashboardData();
    const jsx = generateDashboardJSX(data, request);

    const imageResponse = new ImageResponse(jsx, {
      width: 800,
      height: 480,
    });
    const pngBuffer = await (imageResponse as Response).arrayBuffer();
    const packedBuffer = await generatePackedBuffer(pngBuffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(packedBuffer as any, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': '48000',
      },
    });
  } catch (error) {
    console.error(error);
    const jsx = generateErrorJSX();
    const imageResponse = new ImageResponse(jsx, {
      width: 800,
      height: 480,
    });
    const pngBuffer = await (imageResponse as Response).arrayBuffer();
    const packedBuffer = await generatePackedBuffer(pngBuffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new Response(packedBuffer as any, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': '48000',
      },
    });
  }
}