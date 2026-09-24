import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-static';
export const size = { width: 192, height: 192 };
export const contentType = 'image/png';

export default async function Icon() {
  const logo = await readFile(path.join(process.cwd(), 'public/images/logo.png'));
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#0e1116', alignItems: 'center', justifyContent: 'center' }}>
      {/* Render the existing brand artwork without changing its proportions. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`data:image/png;base64,${logo.toString('base64')}`} width={192} height={129} alt="" />
    </div>,
    size,
  );
}
