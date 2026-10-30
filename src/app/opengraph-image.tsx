import { ImageResponse } from 'next/og';
import { brand } from '@/config/brand';
export const alt = 'Independent digital engineering studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        padding: 70,
        background: '#0a0a0a',
        color: '#f2f3f1',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: 28, letterSpacing: 6 }}>{brand.name}</div>
      <div
        style={{
          display: 'flex',
          fontSize: 95,
          lineHeight: 1.05,
          maxWidth: 1000,
          letterSpacing: -5,
        }}
      >
        {brand.tagline}
      </div>
      <div
        style={{
          display: 'flex',
          borderTop: '1px solid #343a2d',
          paddingTop: 25,
          fontSize: 19,
          color: '#c6ff35',
        }}
      >
        WEB ENGINEERING / SOFTWARE / AUTOMATION / INFRASTRUCTURE
      </div>
    </div>,
    size,
  );
}
