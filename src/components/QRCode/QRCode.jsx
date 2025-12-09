import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

export default function QRCode({ value, size, title, onClick }) {
  const [qrSize, setQrSize] = useState(size || 110);

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width <= 400) {
        setQrSize(size || 90);
      } else if (width <= 600) {
        setQrSize(size || 100);
      } else {
        setQrSize(size || 110);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [size]);

  return (
    <div
      onClick={onClick}
      title={title}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-block',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0.1)',
      }}
      aria-label={title}
    >
      <QRCodeSVG
        value={value}
        size={qrSize}
        level="M"
        includeMargin={false}
        style={{
          borderRadius: '8px',
          border: '1px solid #e6eef4',
          padding: '4px',
          backgroundColor: '#fff',
          display: 'block',
        }}
      />
    </div>
  );
}

