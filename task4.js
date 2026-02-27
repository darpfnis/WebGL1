// ── task4.js ──
// Завдання 4: Довільна фігура через gl.TRIANGLE_FAN із рухом вгору/вниз

import { setupWebGL, createProgram } from './webgl-utils.js';

export function task4() {
  const gl = setupWebGL('canvas4');
  if (!gl) return;

  const vsSrc = `
    attribute vec2 aPosition;
    uniform   float uOffsetY;
    void main() {
      gl_Position = vec4(aPosition.x, aPosition.y + uOffsetY, 0.0, 1.0);
    }
  `;

  // Fragment shader: pastel pink palette that breathes with time
  const fsSrc = `
    precision mediump float;
    uniform float uTime;
    void main() {
      float t = sin(uTime * 1.4) * 0.5 + 0.5;
      // Oscillates between pastel pink and soft peach
      vec3 pink  = vec3(0.957, 0.761, 0.761); // #f4c2c2
      vec3 peach = vec3(0.980, 0.890, 0.820); // #fde4d1
      gl_FragColor = vec4(mix(pink, peach, t), 1.0);
    }
  `;

  const prog = createProgram(gl, vsSrc, fsSrc);
  gl.useProgram(prog);

  // Star-like shape using TRIANGLE_FAN
  // Alternates between outer radius and inner radius to make a 6-pointed star
  const numPoints   = 6;
  const outerRadius = 0.32;
  const innerRadius = 0.16;
  const totalVerts  = numPoints * 2; // outer + inner per point
  const verts = [0.0, 0.0]; // center vertex

  for (let i = 0; i <= totalVerts; i++) {
    const angle  = (i / totalVerts) * 2 * Math.PI - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    verts.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uOffsetY = gl.getUniformLocation(prog, 'uOffsetY');
  const uTime    = gl.getUniformLocation(prog, 'uTime');

  const vertCount = totalVerts + 2; // center + ring + close
  let startTs = null;

  function render(ts) {
    if (!startTs) startTs = ts;
    const t  = (ts - startTs) / 1000;
    const oy = Math.sin(t * 1.1) * 0.52; // smooth bob up/down

    gl.clearColor(0.165, 0.153, 0.145, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uOffsetY, oy);
    gl.uniform1f(uTime, t);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, vertCount);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}