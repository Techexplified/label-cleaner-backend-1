import React from 'react';

export default function TagIllustration() {
  return (
    <div className="tag-illustration-wrap" aria-hidden="true">
      <svg
        width="180"
        height="150"
        viewBox="0 0 180 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="tag-illustration-svg"
      >
        {/* Sparkle / burst lines above tags */}
        <line
          x1="112"
          y1="22"
          x2="112"
          y2="30"
          stroke="#172b4d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="123"
          y1="28"
          x2="130"
          y2="35"
          stroke="#172b4d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <line
          x1="128"
          y1="45"
          x2="136"
          y2="46"
          stroke="#172b4d"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Yellow Tag (Back-Right) */}
        <g transform="translate(100, 42) rotate(32)">
          <rect
            x="0"
            y="0"
            width="58"
            height="34"
            rx="10"
            fill="#FFE380"
            stroke="#FFAB00"
            strokeWidth="3.5"
          />
          {/* Hole */}
          <circle cx="12" cy="17" r="4.5" fill="#FFAB00" />
        </g>

        {/* Blue Tag (Top-Left) */}
        <g transform="translate(74, 25) rotate(-38)">
          <rect
            x="0"
            y="0"
            width="64"
            height="36"
            rx="10"
            fill="#B3D4FF"
            stroke="#0052CC"
            strokeWidth="4"
          />
          {/* Hole */}
          <circle cx="13" cy="18" r="5" fill="#0052CC" />
        </g>

        {/* Green Tag (Bottom-Center) */}
        <g transform="translate(68, 72) rotate(0)">
          <rect
            x="0"
            y="0"
            width="66"
            height="36"
            rx="10"
            fill="#ABF5D1"
            stroke="#00875A"
            strokeWidth="4"
          />
          {/* Hole */}
          <circle cx="53" cy="18" r="5" fill="#00875A" />
        </g>
      </svg>
    </div>
  );
}
