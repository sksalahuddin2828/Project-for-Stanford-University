import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Tag,
  X,
  Info,
  Compass,
  Sparkles,
  Sun,
  Orbit,
  Thermometer,
  Clock,
  Ruler,
  Moon,
  ChevronRight
} from 'lucide-react';

/**
 * ============================================================================
 * SOLAR SYSTEM PLANETARY & STELLAR DATA
 * ============================================================================
 * Comprehensive astronomical data, visual properties, and orbital parameters
 * scaled for smooth interactive canvas rendering.
 */
interface CelestialBody {
  id: string;
  name: string;
  type: 'Star' | 'Terrestrial Planet' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet';
  tagline: string;
  description: string;
  color: string;
  secondaryColor: string;
  glowColor: string;
  radius: number; // Visual radius in pixels at 1x zoom
  distance: number; // Orbital distance from Sun in pixels at 1x zoom
  speed: number; // Angular velocity multiplier (radians per frame baseline)
  initialAngle: number; // Starting orbital angle in radians
  hasRings?: boolean;
  ringColor?: string;
  moonsCount: number;
  notableMoons: string[];
  stats: {
    diameter: string;
    mass: string;
    distanceFromSun: string;
    orbitalPeriod: string;
    dayLength: string;
    temperature: string;
    gravity: string;
  };
  atmosphere: string[];
  funFacts: string[];
}

const SOLAR_SYSTEM_DATA: CelestialBody[] = [
  {
    id: 'sun',
    name: 'Sun',
    type: 'Star',
    tagline: 'The G-Type Main-Sequence Heart of Our Solar System',
    description:
      'The Sun is a nearly perfect sphere of hot plasma, heated to incandescence by nuclear fusion reactions in its core. It accounts for 99.86% of the total mass of the Solar System and radiates the energy that sustains life on Earth.',
    color: '#FDB813',
    secondaryColor: '#F59E0B',
    glowColor: 'rgba(253, 184, 19, 0.45)',
    radius: 34,
    distance: 0,
    speed: 0,
    initialAngle: 0,
    moonsCount: 0,
    notableMoons: [],
    stats: {
      diameter: '1,392,700 km',
      mass: '1.989 × 10³⁰ kg',
      distanceFromSun: '0 km (Center)',
      orbitalPeriod: '230M yrs (Galactic)',
      dayLength: '25.4 Earth days',
      temperature: '5,500 °C (Surface)',
      gravity: '274 m/s²'
    },
    atmosphere: ['Hydrogen (73.4%)', 'Helium (25.0%)', 'Oxygen (0.8%)', 'Carbon (0.3%)'],
    funFacts: [
      'Light from the Sun takes approximately 8 minutes and 20 seconds to reach Earth.',
      'Over 1.3 million Earths could fit inside the volume of the Sun.'
    ]
  },
  {
    id: 'mercury',
    name: 'Mercury',
    type: 'Terrestrial Planet',
    tagline: 'The Swift, Sun-Scorched Innermost World',
    description:
      'Mercury is the smallest and innermost planet in the Solar System. Its cratered surface resembles Earth’s Moon, shaped by billions of years of asteroid and comet impacts alongside extreme thermal expansion and contraction.',
    color: '#A8A29E',
    secondaryColor: '#78716C',
    glowColor: 'rgba(168, 162, 158, 0.3)',
    radius: 5.5,
    distance: 64,
    speed: 0.024,
    initialAngle: 0.8,
    moonsCount: 0,
    notableMoons: [],
    stats: {
      diameter: '4,879 km',
      mass: '3.285 × 10²³ kg',
      distanceFromSun: '57.9 million km',
      orbitalPeriod: '88 Earth days',
      dayLength: '58.6 Earth days',
      temperature: '-180 °C to 430 °C',
      gravity: '3.7 m/s²'
    },
    atmosphere: ['Trace Oxygen', 'Sodium', 'Hydrogen', 'Helium'],
    funFacts: [
      'Despite being closest to the Sun, Mercury is not the hottest planet—Venus holds that title.',
      'A single solar day on Mercury lasts two Mercurian years (176 Earth days).'
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    type: 'Terrestrial Planet',
    tagline: 'Earth’s Shrouded Sister with a Runaway Greenhouse Climate',
    description:
      'Venus is similar in size and structure to Earth, but wrapped in thick, toxic clouds of sulfuric acid that trap heat in a runaway greenhouse effect, making it the hottest planetary surface in our Solar System.',
    color: '#FBBF24',
    secondaryColor: '#D97706',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    radius: 8.5,
    distance: 96,
    speed: 0.0175,
    initialAngle: 2.3,
    moonsCount: 0,
    notableMoons: [],
    stats: {
      diameter: '12,104 km',
      mass: '4.867 × 10²⁴ kg',
      distanceFromSun: '108.2 million km',
      orbitalPeriod: '224.7 Earth days',
      dayLength: '243 Earth days',
      temperature: '465 °C (Average)',
      gravity: '8.87 m/s²'
    },
    atmosphere: ['Carbon Dioxide (96.5%)', 'Nitrogen (3.5%)', 'Sulfur Dioxide'],
    funFacts: [
      'Venus rotates backwards (retrograde) compared to most planets, meaning the Sun rises in the west.',
      'Surface atmospheric pressure on Venus is 92 times greater than on Earth.'
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    type: 'Terrestrial Planet',
    tagline: 'The Pale Blue Dot and Oasis of Liquid Water',
    description:
      'Earth is the third planet from the Sun and the only astronomical object known to harbor life. About 71% of its surface is covered with liquid water oceans, protected by a dynamic magnetic field and nitrogen-oxygen atmosphere.',
    color: '#38BDF8',
    secondaryColor: '#10B981',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    radius: 9.2,
    distance: 134,
    speed: 0.0135,
    initialAngle: 4.1,
    moonsCount: 1,
    notableMoons: ['Luna (The Moon)'],
    stats: {
      diameter: '12,742 km',
      mass: '5.972 × 10²⁴ kg',
      distanceFromSun: '149.6 million km',
      orbitalPeriod: '365.25 days',
      dayLength: '23h 56m',
      temperature: '15 °C (Average)',
      gravity: '9.81 m/s²'
    },
    atmosphere: ['Nitrogen (78.1%)', 'Oxygen (20.9%)', 'Argon (0.9%)', 'CO₂ (0.04%)'],
    funFacts: [
      'Earth is the densest planet in the Solar System at 5.51 g/cm³.',
      'Tectonic plate movement continuously recycles Earth’s crust over geological timescales.'
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    type: 'Terrestrial Planet',
    tagline: 'The Rusty Frontier of Giant Volcanoes and Ancient Riverbeds',
    description:
      'Mars is a cold desert world whose iron oxide-rich soil gives it a distinctive reddish hue. Home to Olympus Mons—the largest volcano in the Solar System—and polar ice caps, Mars shows compelling evidence of ancient liquid water.',
    color: '#F87171',
    secondaryColor: '#B91C1C',
    glowColor: 'rgba(248, 113, 113, 0.35)',
    radius: 7,
    distance: 174,
    speed: 0.0105,
    initialAngle: 5.4,
    moonsCount: 2,
    notableMoons: ['Phobos', 'Deimos'],
    stats: {
      diameter: '6,779 km',
      mass: '6.39 × 10²³ kg',
      distanceFromSun: '227.9 million km',
      orbitalPeriod: '687 Earth days',
      dayLength: '24h 37m',
      temperature: '-65 °C (Average)',
      gravity: '3.72 m/s²'
    },
    atmosphere: ['Carbon Dioxide (95.3%)', 'Nitrogen (2.6%)', 'Argon (1.9%)'],
    funFacts: [
      'Olympus Mons stands nearly 22 km high—roughly 2.5 times the height of Mount Everest.',
      'Sunsets on Mars appear bluish due to fine dust scattering red light in the thin atmosphere.'
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    type: 'Gas Giant',
    tagline: 'King of the Planets and Guardian of the Inner System',
    description:
      'Jupiter is more than twice as massive as all other planets combined. Its swirling bands of ammonia clouds, fierce jet streams, and the centuries-old Great Red Spot storm make it a dynamic colossus surrounded by dozens of moons.',
    color: '#FDBA74',
    secondaryColor: '#C2410C',
    glowColor: 'rgba(253, 186, 116, 0.35)',
    radius: 20,
    distance: 238,
    speed: 0.0068,
    initialAngle: 1.4,
    moonsCount: 95,
    notableMoons: ['Io', 'Europa', 'Ganymede', 'Callisto'],
    stats: {
      diameter: '139,820 km',
      mass: '1.898 × 10²⁷ kg',
      distanceFromSun: '778.5 million km',
      orbitalPeriod: '11.86 Earth years',
      dayLength: '9h 55m',
      temperature: '-110 °C (Cloud top)',
      gravity: '24.79 m/s²'
    },
    atmosphere: ['Hydrogen (89.8%)', 'Helium (10.2%)', 'Methane', 'Ammonia'],
    funFacts: [
      'Jupiter has the shortest day of any planet, completing a full rotation in under 10 hours.',
      'Its moon Europa hides a vast subsurface liquid water ocean beneath an icy crust.'
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    type: 'Gas Giant',
    tagline: 'The Jewel of the Solar System Adorned in Crystalline Rings',
    description:
      'Adorned with a dazzling, complex system of icy rings spanning over 280,000 kilometers, Saturn is a pale-gold gas giant composed primarily of hydrogen and helium, with an average density lower than liquid water.',
    color: '#FDE68A',
    secondaryColor: '#B45309',
    glowColor: 'rgba(253, 230, 138, 0.35)',
    radius: 17,
    distance: 312,
    speed: 0.005,
    initialAngle: 3.6,
    hasRings: true,
    ringColor: 'rgba(234, 211, 156, 0.65)',
    moonsCount: 146,
    notableMoons: ['Titan', 'Enceladus', 'Rhea', 'Mimas'],
    stats: {
      diameter: '116,460 km',
      mass: '5.683 × 10²⁶ kg',
      distanceFromSun: '1.43 billion km',
      orbitalPeriod: '29.45 Earth years',
      dayLength: '10h 33m',
      temperature: '-140 °C (Cloud top)',
      gravity: '10.44 m/s²'
    },
    atmosphere: ['Hydrogen (96.3%)', 'Helium (3.25%)', 'Methane', 'Ammonia'],
    funFacts: [
      'Saturn’s largest moon, Titan, is the only moon with a dense atmosphere and stable liquid lakes (of methane).',
      'Saturn’s rings are remarkably thin—averaging only about 10 meters in vertical thickness.'
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    type: 'Ice Giant',
    tagline: 'The Tilted Cyan Ice Giant Rolling Around the Sun',
    description:
      'Uranus is an ice giant whose upper atmosphere contains methane that absorbs red light, giving it a serene cyan-blue color. Uniquely, its rotational axis is tilted sideways at nearly 98 degrees, causing extreme 21-year seasons.',
    color: '#67E8F9',
    secondaryColor: '#0891B2',
    glowColor: 'rgba(103, 232, 249, 0.35)',
    radius: 12.5,
    distance: 380,
    speed: 0.0036,
    initialAngle: 0.3,
    hasRings: true,
    ringColor: 'rgba(165, 243, 252, 0.3)',
    moonsCount: 28,
    notableMoons: ['Titania', 'Oberon', 'Umbriel', 'Ariel', 'Miranda'],
    stats: {
      diameter: '50,724 km',
      mass: '8.681 × 10²⁵ kg',
      distanceFromSun: '2.87 billion km',
      orbitalPeriod: '84 Earth years',
      dayLength: '17h 14m',
      temperature: '-195 °C (Cloud top)',
      gravity: '8.69 m/s²'
    },
    atmosphere: ['Hydrogen (82.5%)', 'Helium (15.2%)', 'Methane (2.3%)'],
    funFacts: [
      'Uranus holds the record for the coldest planetary temperature ever measured in the Solar System at -224 °C.',
      'Like Venus, Uranus rotates in a retrograde direction relative to its orbit.'
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    type: 'Ice Giant',
    tagline: 'The Deep Azure World of Supersonic Winds',
    description:
      'Neptune is the outermost major planet in our Solar System. Dark, cold, and whipped by the fastest sustained winds of any planet—reaching over 2,100 km/h—Neptune was the first planet located through mathematical predictions rather than direct observation.',
    color: '#60A5FA',
    secondaryColor: '#1D4ED8',
    glowColor: 'rgba(96, 165, 250, 0.4)',
    radius: 12,
    distance: 442,
    speed: 0.0028,
    initialAngle: 4.8,
    moonsCount: 16,
    notableMoons: ['Triton', 'Proteus', 'Nereid'],
    stats: {
      diameter: '49,244 km',
      mass: '1.024 × 10²⁶ kg',
      distanceFromSun: '4.50 billion km',
      orbitalPeriod: '164.8 Earth years',
      dayLength: '16h 06m',
      temperature: '-200 °C (Cloud top)',
      gravity: '11.15 m/s²'
    },
    atmosphere: ['Hydrogen (80.0%)', 'Helium (19.0%)', 'Methane (1.5%)'],
    funFacts: [
      'Since its discovery in 1846, Neptune completed its first full 165-year orbit in 2011.',
      'Neptune’s largest moon, Triton, orbits backwards and is likely a captured Kuiper Belt object.'
    ]
  }
];

/**
 * ============================================================================
 * SPACE CANVAS COMPONENT (Interactive HTML5 2D Orbital Visualization)
 * ============================================================================
 */
interface SpaceCanvasProps {
  bodies: CelestialBody[];
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody | null) => void;
  isPaused: boolean;
  speedMultiplier: number;
  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  showOrbits: boolean;
  showLabels: boolean;
  resetTrigger: number;
}

interface StarPoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface AsteroidPoint {
  distance: number;
  angle: number;
  speed: number;
  size: number;
  alpha: number;
}

const SpaceCanvas: React.FC<SpaceCanvasProps> = ({
  bodies,
  selectedBody,
  onSelectBody,
  isPaused,
  speedMultiplier,
  zoom,
  setZoom,
  showOrbits,
  showLabels,
  resetTrigger
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Store mutable simulation state inside refs to avoid React re-render overhead at 60fps
  const anglesRef = useRef<Record<string, number>>({});
  const panRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);
  const hoveredBodyIdRef = useRef<string | null>(null);
  const screenPositionsRef = useRef<Record<string, { x: number; y: number; r: number }>>({});

  // Background stars and main asteroid belt particles
  const starsRef = useRef<StarPoint[]>([]);
  const asteroidsRef = useRef<AsteroidPoint[]>([]);

  // Initialize orbital angles, background starfield, and asteroid belt once
  useEffect(() => {
    const initialAngles: Record<string, number> = {};
    bodies.forEach((b) => {
      initialAngles[b.id] = b.initialAngle;
    });
    anglesRef.current = initialAngles;

    // Generate 260 twinkling stars
    const stars: StarPoint[] = [];
    for (let i = 0; i < 260; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.8 + 0.4,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }
    starsRef.current = stars;

    // Generate 140 subtle asteroid belt particles between Mars (174) and Jupiter (238)
    const asteroids: AsteroidPoint[] = [];
    for (let i = 0; i < 140; i++) {
      asteroids.push({
        distance: 196 + Math.random() * 20,
        angle: Math.random() * Math.PI * 2,
        speed: 0.0078 + Math.random() * 0.002,
        size: Math.random() * 1.3 + 0.5,
        alpha: Math.random() * 0.35 + 0.15
      });
    }
    asteroidsRef.current = asteroids;
  }, [bodies]);

  // Reset pan offset when resetTrigger increments
  useEffect(() => {
    panRef.current = { x: 0, y: 0 };
  }, [resetTrigger]);

  // Handle responsive canvas sizing with devicePixelRatio sharpness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main 60 FPS Animation Loop
  useEffect(() => {
    let animationFrameId: number;
    let timeTick = 0;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      timeTick += 1;

      // 1. Deep Space Radial Gradient Background
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#0B1120');
      bgGrad.addColorStop(0.55, '#060913');
      bgGrad.addColorStop(1, '#02040A');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Twinkling Starfield
      starsRef.current.forEach((star) => {
        const twinkle = Math.sin(timeTick * star.twinkleSpeed + star.phase) * 0.25;
        const opacity = Math.max(0.08, Math.min(1, star.alpha + twinkle));
        ctx.beginPath();
        ctx.arc(star.x * width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${opacity})`;
        ctx.fill();
      });

      // Center coordinates with user pan offset
      // Shift slightly left on desktop when DetailsPanel is open so the system remains well-framed
      const panelOffset = selectedBody && width >= 768 ? -160 : 0;
      const centerX = width / 2 + panRef.current.x + panelOffset;
      const centerY = height / 2 + panRef.current.y;

      // 3. Render Main Asteroid Belt (between Mars and Jupiter)
      asteroidsRef.current.forEach((ast) => {
        if (!isPaused) {
          ast.angle += ast.speed * speedMultiplier;
        }
        const ax = centerX + Math.cos(ast.angle) * ast.distance * zoom;
        const ay = centerY + Math.sin(ast.angle) * ast.distance * zoom;
        ctx.beginPath();
        ctx.arc(ax, ay, Math.max(0.6, ast.size * Math.sqrt(zoom)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(148, 163, 184, ${ast.alpha})`;
        ctx.fill();
      });

      // 4. Render Orbital Paths
      if (showOrbits) {
        bodies.forEach((body) => {
          if (body.distance <= 0) return;
          const isSelected = selectedBody?.id === body.id;
          const isHovered = hoveredBodyIdRef.current === body.id;

          ctx.beginPath();
          ctx.arc(centerX, centerY, body.distance * zoom, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected
            ? 'rgba(56, 189, 248, 0.65)'
            : isHovered
            ? 'rgba(255, 255, 255, 0.35)'
            : 'rgba(148, 163, 184, 0.14)';
          ctx.lineWidth = isSelected ? 1.6 : 1;
          ctx.stroke();
        });
      }

      // 5. Update Angles & Render Celestial Bodies
      const currentPositions: Record<string, { x: number; y: number; r: number }> = {};

      bodies.forEach((body) => {
        if (!isPaused && body.speed > 0) {
          anglesRef.current[body.id] =
            (anglesRef.current[body.id] ?? body.initialAngle) + body.speed * speedMultiplier;
        }

        const angle = anglesRef.current[body.id] ?? body.initialAngle;
        const bx = centerX + Math.cos(angle) * body.distance * zoom;
        const by = centerY + Math.sin(angle) * body.distance * zoom;
        const scaledRadius = Math.max(2.5, body.radius * Math.pow(zoom, 0.85));

        currentPositions[body.id] = { x: bx, y: by, r: scaledRadius };

        const isSelected = selectedBody?.id === body.id;
        const isHovered = hoveredBodyIdRef.current === body.id;

        // Atmospheric / Stellar Corona Glow
        const glowRadius = body.id === 'sun' ? scaledRadius * 2.6 : scaledRadius * 2.1;
        const glowGrad = ctx.createRadialGradient(bx, by, scaledRadius * 0.2, bx, by, glowRadius);
        glowGrad.addColorStop(0, body.glowColor);
        glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(bx, by, glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Back half of planetary rings (Saturn / Uranus)
        if (body.hasRings) {
          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(-0.32);
          ctx.beginPath();
          ctx.ellipse(0, 0, scaledRadius * 2.35, scaledRadius * 0.68, 0, Math.PI, Math.PI * 2);
          ctx.strokeStyle = body.ringColor || 'rgba(255,255,255,0.45)';
          ctx.lineWidth = Math.max(1.5, scaledRadius * 0.38);
          ctx.stroke();
          ctx.restore();
        }

        // Planet / Star Sphere with 3D Shading Gradient
        const sphereGrad = ctx.createRadialGradient(
          bx - scaledRadius * 0.32,
          by - scaledRadius * 0.32,
          scaledRadius * 0.1,
          bx,
          by,
          scaledRadius
        );
        if (body.id === 'sun') {
          sphereGrad.addColorStop(0, '#FFFBEB');
          sphereGrad.addColorStop(0.45, body.color);
          sphereGrad.addColorStop(1, body.secondaryColor);
        } else {
          sphereGrad.addColorStop(0, body.color);
          sphereGrad.addColorStop(0.75, body.secondaryColor);
          sphereGrad.addColorStop(1, '#090D16');
        }

        ctx.beginPath();
        ctx.arc(bx, by, scaledRadius, 0, Math.PI * 2);
        ctx.fillStyle = sphereGrad;
        ctx.fill();

        // Front half of planetary rings (overlapping planet equator)
        if (body.hasRings) {
          ctx.save();
          ctx.translate(bx, by);
          ctx.rotate(-0.32);
          ctx.beginPath();
          ctx.ellipse(0, 0, scaledRadius * 2.35, scaledRadius * 0.68, 0, 0, Math.PI);
          ctx.strokeStyle = body.ringColor || 'rgba(255,255,255,0.45)';
          ctx.lineWidth = Math.max(1.5, scaledRadius * 0.38);
          ctx.stroke();
          ctx.restore();
        }

        // Earth's Moon miniature orbit indicator
        if (body.id === 'earth' && zoom >= 0.65) {
          const moonAngle = timeTick * 0.045 * (isPaused ? 0 : speedMultiplier);
          const moonDist = scaledRadius + 7 * Math.sqrt(zoom);
          const mx = bx + Math.cos(moonAngle) * moonDist;
          const my = by + Math.sin(moonAngle) * moonDist;
          ctx.beginPath();
          ctx.arc(mx, my, Math.max(1.4, 2 * Math.sqrt(zoom)), 0, Math.PI * 2);
          ctx.fillStyle = '#E2E8F0';
          ctx.fill();
        }

        // Selection or Hover Target Reticle
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(bx, by, scaledRadius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = isSelected ? '#38BDF8' : 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = isSelected ? 2 : 1.25;
          ctx.setLineDash([4, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Planet Name Label
        if (showLabels || isSelected || isHovered) {
          const labelY = by + scaledRadius + (body.hasRings ? 16 : 14);
          ctx.font = `${isSelected || isHovered ? '600' : '500'} 11px Inter, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelected
            ? '#38BDF8'
            : isHovered
            ? '#FFFFFF'
            : 'rgba(203, 213, 225, 0.85)';
          ctx.fillText(body.name, bx, labelY);
        }
      });

      screenPositionsRef.current = currentPositions;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [bodies, isPaused, speedMultiplier, zoom, showOrbits, showLabels, selectedBody]);

  // Helper: Find celestial body under pointer coordinates
  const getBodyAtPoint = useCallback(
    (clientX: number, clientY: number): CelestialBody | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Check in reverse order so smaller foreground planets win over Sun glow
      for (let i = bodies.length - 1; i >= 0; i--) {
        const body = bodies[i];
        const pos = screenPositionsRef.current[body.id];
        if (!pos) continue;
        const dx = x - pos.x;
        const dy = y - pos.y;
        const hitRadius = Math.max(pos.r + 10, 16); // Generous touch/click target
        if (dx * dx + dy * dy <= hitRadius * hitRadius) {
          return body;
        }
      }
      return null;
    },
    [bodies]
  );

  // Mouse & Touch Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartRef.current = {
      x: e.clientX - panRef.current.x,
      y: e.clientY - panRef.current.y
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDraggingRef.current) {
      const nextX = e.clientX - dragStartRef.current.x;
      const nextY = e.clientY - dragStartRef.current.y;
      if (Math.abs(nextX - panRef.current.x) > 3 || Math.abs(nextY - panRef.current.y) > 3) {
        hasMovedRef.current = true;
      }
      panRef.current = { x: nextX, y: nextY };
      if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
      return;
    }

    const hovered = getBodyAtPoint(e.clientX, e.clientY);
    hoveredBodyIdRef.current = hovered ? hovered.id : null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hovered ? 'pointer' : 'grab';
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = false;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = hoveredBodyIdRef.current ? 'pointer' : 'grab';
    }

    // If user clicked/tapped without dragging, select the clicked planet
    if (!hasMovedRef.current) {
      const clickedBody = getBodyAtPoint(e.clientX, e.clientY);
      if (clickedBody) {
        onSelectBody(clickedBody);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(2.6, Math.max(0.4, Number((prev * factor).toFixed(2)))));
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          isDraggingRef.current = false;
          hoveredBodyIdRef.current = null;
        }}
        onWheel={handleWheel}
        className="block w-full h-full touch-none"
      />
    </div>
  );
};

/**
 * ============================================================================
 * DETAILS PANEL COMPONENT (Celestial Telemetry & Information Drawer)
 * ============================================================================
 */
interface DetailsPanelProps {
  body: CelestialBody | null;
  onClose: () => void;
  onSelectNeighbor: (direction: 'prev' | 'next') => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ body, onClose, onSelectNeighbor }) => {
  if (!body) return null;

  return (
    <aside
      aria-label={`${body.name} planetary details`}
      className="fixed inset-x-0 bottom-0 md:inset-y-4 md:right-4 md:left-auto z-30 w-full md:w-[400px] max-h-[78vh] md:max-h-[calc(100vh-2rem)] bg-slate-950/90 backdrop-blur-xl border-t md:border border-slate-800/90 md:rounded-2xl shadow-2xl shadow-black/70 text-slate-100 flex flex-col overflow-hidden transition-all duration-300"
    >
      {/* Top Color Accent Bar */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{
          background: `linear-gradient(90deg, ${body.color}, ${body.secondaryColor})`
        }}
      />

      {/* Header */}
      <div className="p-5 pb-4 border-b border-slate-800/80 flex items-start justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3.5">
          {/* Planet Visual Avatar */}
          <div
            className="w-12 h-12 rounded-full shrink-0 shadow-lg flex items-center justify-center relative"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${body.color}, ${body.secondaryColor})`,
              boxShadow: `0 0 24px ${body.glowColor}`
            }}
          >
            {body.hasRings && (
              <div
                className="absolute w-16 h-4 rounded-full border-2 -rotate-12 pointer-events-none"
                style={{ borderColor: body.ringColor }}
              />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800/90 text-sky-400 border border-slate-700/70">
                {body.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white mt-1">{body.name}</h2>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close details panel"
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-5 overflow-y-auto space-y-5 flex-1">
        <div>
          <p className="text-xs font-medium text-sky-300/90 mb-1.5">{body.tagline}</p>
          <p className="text-sm text-slate-300 leading-relaxed">{body.description}</p>
        </div>

        {/* Key Physical & Orbital Metrics Grid */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Orbit className="w-3.5 h-3.5 text-sky-400" />
            Orbital & Physical Telemetry
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Ruler className="w-3.5 h-3.5 text-amber-400" />
                Diameter
              </div>
              <div className="text-sm font-semibold text-white">{body.stats.diameter}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                Distance from Sun
              </div>
              <div className="text-sm font-semibold text-white">{body.stats.distanceFromSun}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Orbit className="w-3.5 h-3.5 text-emerald-400" />
                Orbital Period
              </div>
              <div className="text-sm font-semibold text-white">{body.stats.orbitalPeriod}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                Rotation / Day
              </div>
              <div className="text-sm font-semibold text-white">{body.stats.dayLength}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                Temperature
              </div>
              <div className="text-sm font-semibold text-white">{body.stats.temperature}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Known Moons
              </div>
              <div className="text-sm font-semibold text-white">{body.moonsCount}</div>
            </div>
          </div>
        </div>

        {/* Atmospheric / Elemental Composition */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            {body.id === 'sun' ? 'Stellar Composition' : 'Atmospheric Composition'}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {body.atmosphere.map((gas) => (
              <span
                key={gas}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
              >
                {gas}
              </span>
            ))}
          </div>
        </div>

        {/* Notable Moons */}
        {body.notableMoons.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Notable Satellites
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {body.notableMoons.map((moon) => (
                <span
                  key={moon}
                  className="text-xs px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-800/50 text-indigo-200"
                >
                  {moon}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Quick Scientific Insights */}
        <div className="p-3.5 rounded-xl bg-sky-950/30 border border-sky-800/40 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Did You Know?
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed list-disc pl-4">
            {body.funFacts.map((fact, idx) => (
              <li key={idx}>{fact}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Quick Navigation Between Celestial Bodies */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between gap-2 shrink-0">
        <button
          onClick={() => onSelectNeighbor('prev')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          ← Previous Body
        </button>
        <span className="text-[11px] text-slate-500">Gravity: {body.stats.gravity}</span>
        <button
          onClick={() => onSelectNeighbor('next')}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          Next Body →
        </button>
      </div>
    </aside>
  );
};

/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT (app/App.tsx)
 * ============================================================================
 */
export default function App() {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const [showOrbits, setShowOrbits] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [resetTrigger, setResetTrigger] = useState<number>(0);

  // Cycle through celestial bodies from the DetailsPanel footer
  const handleSelectNeighbor = useCallback(
    (direction: 'prev' | 'next') => {
      if (!selectedBody) return;
      const currentIndex = SOLAR_SYSTEM_DATA.findIndex((b) => b.id === selectedBody.id);
      if (currentIndex === -1) return;
      const nextIndex =
        direction === 'next'
          ? (currentIndex + 1) % SOLAR_SYSTEM_DATA.length
          : (currentIndex - 1 + SOLAR_SYSTEM_DATA.length) % SOLAR_SYSTEM_DATA.length;
      setSelectedBody(SOLAR_SYSTEM_DATA[nextIndex]);
    },
    [selectedBody]
  );

  // Reset camera zoom, pan, and simulation speed
  const handleResetView = () => {
    setZoom(1);
    setSpeedMultiplier(1);
    setIsPaused(false);
    setResetTrigger((prev) => prev + 1);
  };

  // Keyboard shortcuts (Space = Play/Pause, Escape = Close Panel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'BUTTON') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.code === 'Escape') {
        setSelectedBody(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#02040A] text-slate-100 overflow-hidden font-sans">
      {/* Interactive Orbital Canvas */}
      <SpaceCanvas
        bodies={SOLAR_SYSTEM_DATA}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        isPaused={isPaused}
        speedMultiplier={speedMultiplier}
        zoom={zoom}
        setZoom={setZoom}
        showOrbits={showOrbits}
        showLabels={showLabels}
        resetTrigger={resetTrigger}
      />

      {/* Top-Left Title & Quick Planet Selector Strip */}
      <header className="fixed top-4 left-4 right-4 md:right-auto z-20 flex flex-col gap-2.5 pointer-events-none">
        <div className="pointer-events-auto inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 shadow-xl w-fit">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white leading-tight">
              Solar System Explorer
            </h1>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Click any planet or the Sun to inspect • Drag to pan • Scroll to zoom
            </p>
          </div>
        </div>

        {/* Quick Jump Pills for Sun & All 8 Planets */}
        <nav
          aria-label="Celestial body quick navigation"
          className="pointer-events-auto flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar"
        >
          {SOLAR_SYSTEM_DATA.map((body) => {
            const active = selectedBody?.id === body.id;
            return (
              <button
                key={body.id}
                onClick={() => setSelectedBody(active ? null : body)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 shrink-0 border transition-all cursor-pointer ${
                  active
                    ? 'bg-sky-500/20 border-sky-400/70 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-slate-950/75 hover:bg-slate-900/90 border-slate-800/80 text-slate-300 hover:text-white backdrop-blur-md'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: body.color }}
                />
                {body.name}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Bottom Simulation Controls Bar */}
      <div className="fixed bottom-4 left-4 right-4 md:right-auto z-20 flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-800/80 shadow-2xl w-fit max-w-[calc(100vw-2rem)]">
        {/* Play / Pause Button */}
        <button
          onClick={() => setIsPaused((prev) => !prev)}
          title={isPaused ? 'Resume Simulation (Space)' : 'Pause Simulation (Space)'}
          className="px-3 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
          <span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>

        {/* Orbital Speed Selector */}
        <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800/80">
          {[0.5, 1, 2, 4].map((spd) => (
            <button
              key={spd}
              onClick={() => {
                setSpeedMultiplier(spd);
                if (isPaused) setIsPaused(false);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                speedMultiplier === spd && !isPaused
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.2).toFixed(2))))}
            aria-label="Zoom out"
            title="Zoom Out"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 min-w-[44px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(2.6, Number((z + 0.2).toFixed(2))))}
            aria-label="Zoom in"
            title="Zoom In"
            className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

        {/* Visibility Toggles: Orbits & Labels */}
        <button
          onClick={() => setShowOrbits((prev) => !prev)}
          title="Toggle Orbital Paths"
          className={`px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
            showOrbits
              ? 'bg-slate-800/90 border-slate-700 text-sky-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          {showOrbits ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Orbits</span>
        </button>

        <button
          onClick={() => setShowLabels((prev) => !prev)}
          title="Toggle Planet Labels"
          className={`px-2.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-colors cursor-pointer ${
            showLabels
              ? 'bg-slate-800/90 border-slate-700 text-sky-300'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Labels</span>
        </button>

        {/* Reset Camera & Speed */}
        <button
          onClick={handleResetView}
          title="Reset Camera & Speed"
          className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Onboarding Hint Pill when no planet is selected */}
      {!selectedBody && (
        <div className="fixed top-4 right-4 z-20 hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/75 backdrop-blur-md border border-slate-800/80 text-xs text-slate-300">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>Select a celestial body to view telemetry</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </div>
      )}

      {/* Detailed Planetary Telemetry Drawer */}
      <DetailsPanel
        body={selectedBody}
        onClose={() => setSelectedBody(null)}
        onSelectNeighbor={handleSelectNeighbor}
      />
    </div>
  );
}