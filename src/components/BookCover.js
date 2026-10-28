import React, { useState } from 'react';

// Book cover: shows the book's real image (book.cover URL) when it has one.
// If there is no URL, or the image fails to load, it draws an illustrated SVG instead.
// The SVG motif is based on the book's coverPattern, falling back to its category.

const PATTERN_MOTIF = {
  circles: 'target',
  waves: 'bulb',
  geometric: 'stairs',
  night: 'moon',
  stars: 'heart',
  space: 'rocket',
  minimal: 'keyhole',
  gothic: 'house',
  playful: 'cat',
  nebula: 'planet',
};

const CATEGORY_MOTIF = {
  Classic: 'quill',
  Fiction: 'book',
  'Self-help': 'sun',
  History: 'temple',
  Memoir: 'person',
  Romance: 'heart',
  Mystery: 'magnifier',
  'Science Fiction': 'rocket',
  Fantasy: 'castle',
  Historical: 'temple',
  'Historical Fiction': 'temple',
  Thriller: 'keyhole',
  Psychology: 'bulb',
  Business: 'stairs',
  Adventure: 'compass',
  Biography: 'person',
  'Self-Help': 'sun',
  Travel: 'compass',
  Cooking: 'chef',
  "Children's": 'cat',
  'Young Adult': 'bolt',
  'Comics & Graphic Novels': 'burst',
  Poetry: 'quill',
  Drama: 'masks',
  Science: 'atom',
  Philosophy: 'sun',
  Religion: 'sun',
  'Language Learning': 'bubbles',
};

const W = '#ffffff';
const SOFT = 'rgba(255,255,255,0.35)';
const DARK = 'rgba(0,0,0,0.35)';
const GOLD = '#fbbf24';

function Motif({ name, accent }) {
  const line = { fill: 'none', stroke: W, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'target':
      return (
        <g>
          <circle r="42" fill={SOFT} stroke={W} strokeWidth="3" />
          <circle r="28" fill="none" stroke={W} strokeWidth="3" />
          <circle r="14" fill={W} />
          <circle r="5" fill={accent} />
          <path d="M6,-6 L46,-46 M36,-46 h10 v10" {...line} stroke={GOLD} />
        </g>
      );
    case 'bulb':
      return (
        <g>
          <circle cy="-12" r="30" fill={SOFT} stroke={W} strokeWidth="3" />
          <path d="M-8,10 v-14 l8,-8 l8,8 v14" {...line} strokeWidth="3" />
          <path d="M-13,24 h26 M-9,34 h18" {...line} />
          <path d="M0,-52 v-8 M-38,-30 l-7,-5 M38,-30 l7,-5" {...line} stroke={GOLD} strokeWidth="3" />
        </g>
      );
    case 'stairs':
      return (
        <g>
          <polyline points="-46,42 -46,26 -22,26 -22,6 2,6 2,-14 26,-14" {...line} />
          <path d="M-36,12 L38,-42 M18,-44 L38,-42 L34,-22" {...line} stroke={GOLD} />
        </g>
      );
    case 'moon':
      return (
        <g>
          <path d="M12,-46 a46,46 0 1 0 34,62 a36,36 0 1 1 -34,-62z" fill={W} />
          <circle cx="-30" cy="-34" r="3" fill={GOLD} />
          <circle cx="34" cy="-30" r="2.5" fill={GOLD} />
          <circle cx="40" cy="30" r="2" fill={GOLD} />
        </g>
      );
    case 'heart':
      return (
        <g>
          <path d="M0,40 C-62,0 -36,-46 0,-18 C36,-46 62,0 0,40z" fill={SOFT} stroke={W} strokeWidth="3" />
          <circle cx="-44" cy="-34" r="3" fill={GOLD} />
          <circle cx="44" cy="-38" r="2.5" fill={GOLD} />
          <circle cx="0" cy="-46" r="2" fill={GOLD} />
        </g>
      );
    case 'rocket':
      return (
        <g>
          <path d="M-14,10 l-20,24 l20,-6z M14,10 l20,24 l-20,-6z" fill={GOLD} />
          <path d="M0,-50 C20,-32 22,0 15,26 h-30 C-22,0 -20,-32 0,-50z" fill={W} />
          <circle cy="-12" r="8" fill={accent} stroke={DARK} strokeWidth="2" />
          <path d="M-8,30 l8,22 l8,-22z" fill="#f97316" />
        </g>
      );
    case 'keyhole':
      return (
        <g>
          <circle cy="-4" r="38" fill="none" stroke={W} strokeWidth="4" />
          <circle cy="-12" r="9" fill={W} />
          <path d="M-6,-4 l-6,30 h24 l-6,-30z" fill={W} />
        </g>
      );
    case 'house':
      return (
        <g>
          <path d="M-42,42 V-4 L0,-44 L42,-4 V42z" fill={DARK} stroke={W} strokeWidth="3" strokeLinejoin="round" />
          <rect x="-9" y="6" width="18" height="22" fill={GOLD} />
          <path d="M-60,50 h120" {...line} strokeWidth="3" />
        </g>
      );
    case 'cat':
      return (
        <g>
          <path d="M-32,-16 L-36,-50 L-8,-32z M32,-16 L36,-50 L8,-32z" fill="#fdba74" stroke={W} strokeWidth="3" strokeLinejoin="round" />
          <circle cy="6" r="36" fill="#fdba74" stroke={W} strokeWidth="3" />
          <circle cx="-13" cy="0" r="5" fill="#1f2937" />
          <circle cx="13" cy="0" r="5" fill="#1f2937" />
          <path d="M-5,12 h10 l-5,7z" fill="#f43f5e" />
          <path d="M-36,10 h-14 M-36,18 l-13,5 M36,10 h14 M36,18 l13,5" {...line} strokeWidth="2" />
        </g>
      );
    case 'planet':
      return (
        <g>
          <circle r="28" fill={SOFT} stroke={W} strokeWidth="3" />
          <ellipse rx="52" ry="14" transform="rotate(-20)" fill="none" stroke={W} strokeWidth="4" />
          <circle cx="-40" cy="-40" r="3" fill={GOLD} />
          <circle cx="42" cy="-34" r="2" fill={GOLD} />
        </g>
      );
    case 'temple':
      return (
        <g fill={W}>
          <path d="M-46,-14 L0,-46 L46,-14z" />
          <rect x="-36" y="-8" width="12" height="44" />
          <rect x="-6" y="-8" width="12" height="44" />
          <rect x="24" y="-8" width="12" height="44" />
          <rect x="-48" y="38" width="96" height="9" rx="2" />
        </g>
      );
    case 'castle':
      return (
        <g fill={W}>
          <rect x="-34" y="-6" width="68" height="46" />
          <rect x="-46" y="-34" width="26" height="74" />
          <rect x="20" y="-34" width="26" height="74" />
          <path d="M-46,-34 l4,-10 h6 l4,10z M20,-34 l4,-10 h6 l4,10z" />
          <path d="M-9,40 v-16 a9,9 0 0 1 18,0 v16z" fill={accent} />
          <circle cx="0" cy="-34" r="3" fill={GOLD} />
        </g>
      );
    case 'chef':
      return (
        <g fill={W}>
          <circle cx="-20" cy="-14" r="19" />
          <circle cx="20" cy="-14" r="19" />
          <circle cx="0" cy="-28" r="21" />
          <rect x="-28" y="-2" width="56" height="30" />
          <rect x="-28" y="32" width="56" height="10" rx="3" />
        </g>
      );
    case 'compass':
      return (
        <g>
          <circle r="42" fill="none" stroke={W} strokeWidth="4" />
          <polygon points="0,-30 9,0 -9,0" fill={W} />
          <polygon points="0,30 9,0 -9,0" fill={SOFT} />
          <circle r="4" fill={GOLD} />
        </g>
      );
    case 'person':
      return (
        <g fill={W}>
          <circle cy="-20" r="19" />
          <path d="M-36,44 C-36,8 36,8 36,44z" />
        </g>
      );
    case 'quill':
      return (
        <g>
          <path d="M32,-48 C-10,-34 -32,0 -36,40 C-10,26 22,8 32,-48z" fill={W} />
          <path d="M-36,40 L-18,18" {...line} stroke={accent} strokeWidth="3" />
        </g>
      );
    case 'masks':
      return (
        <g>
          <circle cx="-14" cy="-4" r="26" fill={W} />
          <circle cx="-22" cy="-10" r="3.5" fill={accent} />
          <circle cx="-6" cy="-10" r="3.5" fill={accent} />
          <path d="M-24,4 q10,10 20,0" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" />
          <circle cx="16" cy="8" r="26" fill={SOFT} stroke={W} strokeWidth="3" />
          <circle cx="8" cy="2" r="3.5" fill={W} />
          <circle cx="24" cy="2" r="3.5" fill={W} />
          <path d="M6,22 q10,-10 20,0" fill="none" stroke={W} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'burst':
      return (
        <g>
          <path d="M-46,-30 h92 v52 h-52 l-22,20 v-20 h-18z" fill={W} />
          <text x="0" y="3" textAnchor="middle" fontSize="24" fontWeight="900" fill={accent} fontFamily="Impact, Arial Black, sans-serif">
            POW!
          </text>
        </g>
      );
    case 'bubbles':
      return (
        <g>
          <rect x="-48" y="-36" width="64" height="42" rx="12" fill={W} />
          <text x="-16" y="-9" textAnchor="middle" fontSize="18" fontWeight="800" fill={accent} fontFamily="Arial, sans-serif">Hi</text>
          <rect x="-16" y="0" width="64" height="42" rx="12" fill={SOFT} stroke={W} strokeWidth="3" />
          <text x="16" y="27" textAnchor="middle" fontSize="18" fontWeight="800" fill={W} fontFamily="Arial, sans-serif">Hola</text>
        </g>
      );
    case 'bolt':
      return <path d="M12,-48 L-26,6 h22 l-12,42 L30,-8 H8z" fill={W} />;
    case 'atom':
      return (
        <g fill="none" stroke={W} strokeWidth="3">
          <ellipse rx="46" ry="16" />
          <ellipse rx="46" ry="16" transform="rotate(60)" />
          <ellipse rx="46" ry="16" transform="rotate(120)" />
          <circle r="7" fill={GOLD} stroke="none" />
        </g>
      );
    case 'magnifier':
      return (
        <g>
          <circle cx="-8" cy="-8" r="28" fill={SOFT} stroke={W} strokeWidth="7" />
          <path d="M14,14 L44,44" {...line} strokeWidth="10" />
        </g>
      );
    case 'sun':
      return (
        <g>
          <circle r="20" fill={W} />
          <g stroke={W} strokeWidth="4" strokeLinecap="round">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
              <line key={a} x1="0" y1="-30" x2="0" y2="-44" transform={`rotate(${a})`} />
            ))}
          </g>
        </g>
      );
    default:
      return (
        <g fill={W}>
          <path d="M0,-22 C-20,-34 -40,-34 -50,-30 V32 C-40,28 -20,28 0,38z" />
          <path d="M0,-22 C20,-34 40,-34 50,-30 V32 C40,28 20,28 0,38z" opacity="0.8" />
        </g>
      );
  }
}

function wrapTitle(title, max = 11) {
  const words = title.split(' ');
  const lines = [];
  let cur = '';
  words.forEach(w => {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  });
  if (cur) lines.push(cur);
  return lines;
}

export default function BookCover({ book, className = '', showText = true }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (book.cover && !imageFailed) {
    return (
      <div
        className={`book-cover rounded-md bg-slate-200 ${className}`}
        style={{ aspectRatio: '2 / 3' }}
      >
        <img
          src={book.cover}
          alt={`${book.title} by ${book.author}`}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="block w-full h-full object-cover"
        />
      </div>
    );
  }

  const motif = PATTERN_MOTIF[book.coverPattern] || CATEGORY_MOTIF[book.category] || 'book';
  const c1 = book.coverColor || '#4f46e5';
  const c2 = book.coverAccent || '#312e81';
  const gid = `bc-grad-${book.id}`;
  const lines = wrapTitle(book.title.toUpperCase());
  const longest = Math.max(...lines.map(l => l.length));
  const fontSize = longest > 10 ? 21 : longest > 8 ? 24 : 28;
  const textStyle = { paintOrder: 'stroke', stroke: 'rgba(0,0,0,0.4)', strokeWidth: 3, strokeLinejoin: 'round' };

  return (
    <div
      className={`book-cover rounded-md ${className}`}
      style={{ aspectRatio: '2 / 3' }}
      role="img"
      aria-label={`${book.title} by ${book.author}`}
    >
      <svg viewBox="0 0 200 300" className="block w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <rect width="200" height="300" fill={`url(#${gid})`} />
        <rect x="10" y="10" width="180" height="280" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

        {showText && (
          <g textAnchor="middle" fill="#fff" fontFamily="Georgia, 'Times New Roman', serif" fontWeight="800">
            {lines.map((l, i) => (
              <text key={i} x="100" y={50 + i * (fontSize + 5)} fontSize={fontSize} style={textStyle}>
                {l}
              </text>
            ))}
          </g>
        )}

        <g transform={showText ? 'translate(100 180) scale(1.05)' : 'translate(100 150) scale(1.9)'}>
          <Motif name={motif} accent={c1} />
        </g>

        {showText && (
          <text
            x="100"
            y="272"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            letterSpacing="2"
            fill="#fff"
            fontFamily="Arial, sans-serif"
            style={textStyle}
          >
            {book.author.toUpperCase()}
          </text>
        )}
      </svg>
    </div>
  );
}
