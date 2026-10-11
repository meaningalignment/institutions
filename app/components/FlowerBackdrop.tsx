import { useEffect, useState } from "react";

const PETALS = ["#e8a0b4", "#f2b48c", "#b9a3dd", "#f3d98b"];
const STEM = "#8fa98a";

type Bloom = [x: number, y: number, size: number, colour: number, turn: number];
type Leaf = [x: number, y: number, turn: number];

function Blooms({ blooms }: { blooms: Bloom[] }) {
  return blooms.map(([x, y, size, colour, turn], i) => (
    <use
      key={i}
      href="#appr-bloom"
      x={x - size / 2}
      y={y - size / 2}
      width={size}
      height={size}
      transform={`rotate(${turn} ${x} ${y})`}
      style={{ color: PETALS[colour] }}
    />
  ));
}

function Leaves({ leaves }: { leaves: Leaf[] }) {
  return leaves.map(([x, y, turn], i) => (
    <ellipse key={i} cx={x} cy={y} rx={17} ry={6} fill={STEM} transform={`rotate(${turn} ${x} ${y})`} />
  ));
}

/**
 * Decorative flowers behind the appreciate page: a blossom branch off the top-right corner and a
 * few stems in the bottom-right, swaying under an animated displacement ("wind") filter.
 */
export function FlowerBackdrop() {
  // The filter's SMIL animation can't be switched off from CSS, so it's only rendered once we
  // know the visitor hasn't asked for reduced motion.
  const [windy, setWindy] = useState(false);
  useEffect(() => {
    setWindy(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="appr-backdrop" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="appr-wind" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" numOctaves="2" seed="3" baseFrequency="0.008 0.006">
              {windy && (
                <animate
                  attributeName="baseFrequency"
                  dur="18s"
                  keyTimes="0;0.33;0.66;1"
                  values="0.008 0.006;0.013 0.011;0.01 0.007;0.008 0.006"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="14">
              {windy && (
                <animate
                  attributeName="scale"
                  dur="22s"
                  keyTimes="0;0.25;0.5;0.75;1"
                  values="12;16;22;16;12"
                  repeatCount="indefinite"
                />
              )}
            </feDisplacementMap>
          </filter>
          <symbol id="appr-bloom" viewBox="-50 -50 100 100">
            {[0, 72, 144, 216, 288].map((turn) => (
              <ellipse
                key={turn}
                cx="0"
                cy="-25"
                rx="16"
                ry="24"
                fill="currentColor"
                transform={`rotate(${turn})`}
              />
            ))}
            <circle r="9" fill="#f6e3a1" />
          </symbol>
        </defs>
      </svg>

      <svg className="appr-cluster appr-cluster-top" viewBox="0 0 600 420">
        <g fill="none" stroke={STEM} strokeLinecap="round">
          <path d="M620,-10 C520,60 430,90 330,150 S180,250 110,300" strokeWidth="6" />
          <path d="M470,80 q-14,52 -52,92" strokeWidth="4" />
          <path d="M390,118 q-34,-22 -60,-70" strokeWidth="4" />
          <path d="M250,198 q14,52 -8,100" strokeWidth="4" />
          <path d="M200,232 q-48,-12 -84,-48" strokeWidth="3.5" />
        </g>
        <Leaves
          leaves={[
            [520, 62, 150],
            [440, 120, 110],
            [352, 96, 60],
            [300, 180, 150],
            [262, 250, 70],
            [160, 208, 30],
            [150, 290, 160],
          ]}
        />
        <Blooms
          blooms={[
            [560, 30, 58, 0, 10],
            [488, 62, 46, 2, 40],
            [418, 172, 66, 0, 25],
            [448, 132, 38, 3, 60],
            [330, 48, 60, 1, 5],
            [368, 86, 36, 0, 50],
            [330, 150, 44, 2, 15],
            [242, 298, 62, 1, 35],
            [268, 232, 34, 0, 0],
            [116, 184, 54, 2, 20],
            [172, 214, 34, 3, 45],
            [110, 300, 50, 0, 30],
          ]}
        />
      </svg>

      <svg className="appr-cluster appr-cluster-bottom" viewBox="0 0 400 420">
        <g fill="none" stroke={STEM} strokeLinecap="round" strokeWidth="4">
          <path d="M340,430 C330,330 362,250 310,160" />
          <path d="M280,430 C270,350 222,300 200,228" />
          <path d="M372,430 C380,360 390,322 370,268" />
          <path d="M230,430 C210,382 150,372 118,330" />
        </g>
        <Leaves
          leaves={[
            [344, 300, 60],
            [326, 232, 130],
            [252, 330, 50],
            [226, 280, 120],
            [382, 340, 100],
            [180, 372, 20],
          ]}
        />
        <Blooms
          blooms={[
            [310, 160, 70, 3, 10],
            [200, 228, 58, 0, 30],
            [370, 268, 44, 2, 55],
            [118, 330, 50, 1, 20],
          ]}
        />
      </svg>
    </div>
  );
}
