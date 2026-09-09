import React from 'react';

export default function RiderIllustration({ className = '', animated = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className} ${animated ? 'animate-soft-float' : ''}`}>
      <svg 
        viewBox="0 0 400 320" 
        className="w-full h-auto max-w-[280px] drop-shadow-md" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft shadow underneath scooter */}
        <ellipse cx="200" cy="290" rx="140" ry="16" fill="#3E1809" opacity="0.12" />

        {/* Back Wheel */}
        <circle cx="110" cy="250" r="32" fill="#22292A" />
        <circle cx="110" cy="250" r="20" fill="#E4E7E9" />
        <circle cx="110" cy="250" r="8" fill="#333C3E" />

        {/* Front Wheel */}
        <circle cx="295" cy="250" r="32" fill="#22292A" />
        <circle cx="295" cy="250" r="20" fill="#E4E7E9" />
        <circle cx="295" cy="250" r="8" fill="#333C3E" />

        {/* Scooter Body Frame (Terracotta / Rust) */}
        {/* Rear fender & body */}
        <path 
          d="M 90 240 Q 100 200 150 200 L 190 205 L 185 255 L 125 255 Z" 
          fill="#8B3A1C" 
        />
        <path 
          d="M 120 205 Q 160 195 200 200 L 225 260 L 160 260 Z" 
          fill="#9C4A28" 
        />
        {/* Floorboard */}
        <path d="M 175 255 L 245 255 L 240 265 L 170 265 Z" fill="#333C3E" />

        {/* Front apron & steering column */}
        <path 
          d="M 235 255 Q 260 220 270 170 L 285 170 Q 280 230 290 245 L 275 255 Z" 
          fill="#9C4A28" 
        />
        <path 
          d="M 270 170 L 290 170 L 305 240 L 285 240 Z" 
          fill="#8B3A1C" 
        />
        {/* Front mudguard */}
        <path 
          d="M 270 235 Q 295 210 325 240 Q 305 235 270 235 Z" 
          fill="#9C4A28" 
        />

        {/* Handlebar & headlight */}
        <path d="M 265 168 L 295 168" stroke="#333C3E" strokeWidth="6" strokeLinecap="round" />
        <circle cx="288" cy="166" r="8" fill="#FAF6EE" stroke="#333C3E" strokeWidth="3" />

        {/* Scooter Seat */}
        <path 
          d="M 145 200 C 145 190, 195 190, 215 200 C 205 208, 155 208, 145 200 Z" 
          fill="#22292A" 
        />

        {/* Delivery Box (Mounted at rear) */}
        <g id="delivery-box">
          <rect x="70" y="130" width="75" height="75" rx="8" fill="#FAF6EE" stroke="#D7A68E" strokeWidth="2.5" />
          <rect x="74" y="134" width="67" height="67" rx="6" fill="#FFFDF8" />
          
          {/* HomePot Logo Badge on Box */}
          <circle cx="107.5" cy="170" r="22" fill="#FFFFFF" stroke="#9C4A28" strokeWidth="1.5" />
          {/* Mini clay pot icon on box */}
          <path d="M 98 166 Q 107.5 160 117 166" stroke="#9C4A28" strokeWidth="1.5" fill="none" />
          <path d="M 98 168 Q 94 176 107.5 178 Q 121 176 117 168 Z" fill="#9C4A28" />
          <text x="107.5" y="186" textAnchor="middle" fontSize="6.5" fontFamily="'Playfair Display', serif" fill="#333C3E" fontWeight="bold">
            HomePot
          </text>
        </g>

        {/* Rider */}
        <g id="rider">
          {/* Legs & Shoes */}
          {/* Thigh */}
          <path d="M 180 200 L 225 210 L 225 248 L 205 250 L 175 215 Z" fill="#3E484A" />
          {/* Shoe */}
          <path d="M 210 252 L 235 252 C 240 252 242 258 238 260 L 210 260 Z" fill="#22292A" />

          {/* Torso / Jacket (Warm camel/terracotta jacket) */}
          <path 
            d="M 175 160 L 165 205 L 195 208 L 210 165 Z" 
            fill="#BD7553" 
          />
          {/* Arm gripping handle */}
          <path 
            d="M 195 165 Q 230 175 270 170" 
            stroke="#BD7553" 
            strokeWidth="16" 
            strokeLinecap="round" 
          />
          {/* Hand glove */}
          <circle cx="270" cy="170" r="8" fill="#333C3E" />

          {/* Head & Helmet */}
          {/* Neck */}
          <rect x="180" y="145" width="12" height="15" fill="#E8C9B8" />
          {/* Helmet (Terracotta / warm earth tone) */}
          <circle cx="185" cy="130" r="22" fill="#9C4A28" />
          <path 
            d="M 172 135 C 172 120 198 120 205 130 C 205 140 185 145 172 135 Z" 
            fill="#333C3E" 
          />
          {/* Helmet strap / visor highlight */}
          <path 
            d="M 190 120 Q 200 125 204 135" 
            stroke="#FFFFFF" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            opacity="0.6" 
          />
        </g>
      </svg>
    </div>
  );
}
