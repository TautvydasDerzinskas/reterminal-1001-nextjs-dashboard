import { ImageResponse } from '@vercel/og';
import sharp from 'sharp';
import { NextRequest } from 'next/server';
import { fetchDashboardData, generateDashboardJSX, generateErrorJSX } from '../../../lib/dashboard';

export const runtime = 'nodejs';

async function generatePackedBuffer(pngBuffer: ArrayBuffer): Promise<Buffer> {
  const image = sharp(Buffer.from(pngBuffer)).greyscale().raw();
  const { data, info } = await image.toBuffer({ resolveWithObject: true });
  const width = info.width;
  const height = info.height;
  const packed = Buffer.alloc(width * height / 8);
  let packedIndex = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 8) {
      let byte = 0;
      for (let bit = 0; bit < 8; bit++) {
        const pixelIndex = (y * width + x + bit) * info.channels;
        const value = data[pixelIndex];
        // 1 for white (set pixel), 0 for black
        const bitValue = value > 128 ? 1 : 0;
        byte |= bitValue << (7 - bit);
      }
      packed[packedIndex++] = byte;
    }
  }
  return packed;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const format = url.searchParams.get('format');

  try {
    const data = await fetchDashboardData();
    const jsx = generateDashboardJSX(data);

    const imageResponse = new ImageResponse(jsx, {
      width: 800,
      height: 480,
    });
    const pngBuffer = await (imageResponse as Response).arrayBuffer();
    if (format === 'png') {
      return new Response(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
        },
      });
    }
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
    if (format === 'png') {
      return new Response(pngBuffer, {
        headers: {
          'Content-Type': 'image/png',
        },
      });
    }
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