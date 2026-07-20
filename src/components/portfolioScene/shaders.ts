/* -------------------------------------------------------------------------- */
/*  GLSL programs for the portfolio gallery.                                    */
/*                                                                              */
/*  Two small custom materials, written by hand rather than pulled from a       */
/*  post-processing lib:                                                        */
/*    · PARTICLE — the image-made-of-points system that dissolves a panel and   */
/*      reforms it as the detail hero.                                          */
/*    · STAR     — the twinkling deep-space backdrop.                           */
/*                                                                              */
/*  Colour note: these ShaderMaterials do not include <colorspace_fragment>,    */
/*  so fragment output is written straight to the framebuffer. We therefore     */
/*  feed already-sRGB colours (sampled from the source images) and they render  */
/*  as-authored — matching the MeshBasicMaterial panels alongside them.         */
/* -------------------------------------------------------------------------- */

export const PARTICLE_VERT = /* glsl */ `
  attribute vec3 aScatter;   // exploded-cloud position for this point
  attribute vec3 aColor;     // sampled image colour (sRGB, 0..1)
  attribute float aSeed;     // per-point randomness

  uniform float uScatter;    // 0 = assembled image, 1 = fully scattered
  uniform float uSize;       // base point size
  uniform float uTime;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vScatter;

  void main() {
    vColor = aColor;
    vScatter = uScatter;

    // 'position' is the assembled target (the image). Drift the cloud a little
    // while scattered so the burst breathes instead of freezing mid-air.
    vec3 scattered = aScatter;
    float s = uScatter;
    scattered.x += sin(uTime * 0.8 + aSeed * 6.2831) * 0.35 * s;
    scattered.y += cos(uTime * 0.7 + aSeed * 6.2831) * 0.35 * s;
    scattered.z += sin(uTime * 0.9 + aSeed * 3.1415) * 0.35 * s;

    // Ease so points snap crisply into the image near the ends of the blend.
    float e = s * s * (3.0 - 2.0 * s);
    vec3 pos = mix(position, scattered, e);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * mix(1.0, 1.9, s);
    gl_PointSize = size * uPixelRatio * (300.0 / max(-mv.z, 0.001));
  }
`

export const PARTICLE_FRAG = /* glsl */ `
  precision highp float;

  uniform float uOpacity;

  varying vec3 vColor;
  varying float vScatter;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    // Soft round point; scattered points glow a touch brighter at the core.
    float a = smoothstep(0.25, 0.0, d);
    vec3 col = vColor + vScatter * 0.15;
    gl_FragColor = vec4(col, a * uOpacity);
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
