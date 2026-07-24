/* -------------------------------------------------------------------------- */
/*  GLSL programs for the portfolio gallery.                                    */
/*                                                                              */
/*  Two small custom materials, written by hand rather than pulled from a       */
/*  post-processing lib:                                                        */
/*    · CARD — the flight-card that carries a panel's screenshot to the detail  */
/*      hero, rippling like a sheet of paper mid-flight and landing flat.       */
/*    · STAR — the twinkling deep-space backdrop.                               */
/*                                                                              */
/*  Colour note: these ShaderMaterials do not include <colorspace_fragment>,    */
/*  so fragment output is written straight to the framebuffer. We therefore     */
/*  feed already-sRGB colours (sampled from the source images) and they render  */
/*  as-authored — matching the MeshBasicMaterial panels alongside them.         */
/* -------------------------------------------------------------------------- */

export const CARD_VERT = /* glsl */ `
  uniform float uBend;   // 0 = flat (both ends of the flight), 1 = peak mid-flight
  uniform float uTime;

  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;

    // Two travelling waves plus a corner curl ripple the sheet in local Z.
    // All terms are scaled by uBend, so the card is dead flat at take-off and
    // landing — it must line up exactly with the panel and the detail hero.
    float w1 = sin(uv.x * 6.2832 + uTime * 3.2);
    float w2 = sin(uv.x * 11.0 + uv.y * 4.0 + uTime * 4.4);
    float curl = (uv.x - 0.5) * (uv.y - 0.5) * 1.4;
    vec3 pos = position;
    pos.z += (w1 * 0.16 + w2 * 0.05 + curl * 0.35) * uBend;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Slope of the primary wave — a fake sheen so the flutter still reads
    // when the card faces the camera dead-on.
    vShade = cos(uv.x * 6.2832 + uTime * 3.2) * uBend;
  }
`

export const CARD_FRAG = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uBend;

  varying vec2 vUv;
  varying float vShade;

  void main() {
    // A whisper of chromatic split while the sheet is in motion.
    float shift = 0.006 * uBend;
    vec3 col = vec3(
      texture2D(uMap, vUv + vec2(shift, 0.0)).r,
      texture2D(uMap, vUv).g,
      texture2D(uMap, vUv - vec2(shift, 0.0)).b
    );
    col *= 1.0 + vShade * 0.12;
    gl_FragColor = vec4(col, uOpacity);
  }
`

export const STAR_VERT = /* glsl */ `
  attribute float aSeed;

  uniform float uTime;
  uniform float uPixelRatio;

  varying float vTw;

  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;

    float tw = 0.5 + 0.5 * sin(uTime * 1.4 + aSeed * 6.2831);
    vTw = tw;
    gl_PointSize = (1.0 + 2.4 * aSeed) * uPixelRatio * (0.6 + 0.8 * tw);
  }
`

export const STAR_FRAG = /* glsl */ `
  precision highp float;

  uniform float uOpacity;
  uniform vec3 uColor;

  varying float vTw;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, (0.25 + 0.75 * vTw) * uOpacity);
  }
`
