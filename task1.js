// ── task1.js ──
// Завдання 1: Налаштування WebGL контексту + довільний колір тла

import { setupWebGL } from './webgl-utils.js';

export function task1() {
  const gl = setupWebGL('canvas1');
  if (!gl) return;

  // Pastel pink background to match the UI theme
  gl.clearColor(0.957, 0.761, 0.761, 1.0); // #f4c2c2
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw a small decorative dot pattern using gl.POINTS
  const vsSrc = `
    attribute vec2 aPosition;
    void main() {
      gl_Position  = vec4(aPosition, 0.0, 1.0);
      gl_PointSize = 6.0;
    }
  `;
  const fsSrc = `
    precision mediump float;
    void main() {
      float d = distance(gl_PointCoord, vec2(0.5));
      if (d > 0.5) discard;
      gl_FragColor = vec4(1.0, 1.0, 1.0, 0.55);
    }
  `;

  const prog = gl.createProgram();
  const vs = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vs, vsSrc); gl.compileShader(vs); gl.attachShader(prog, vs);
  const fs = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fs, fsSrc); gl.compileShader(fs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const dots = [];
  for (let x = -0.85; x <= 0.85; x += 0.22)
    for (let y = -0.85; y <= 0.85; y += 0.22)
      dots.push(x, y);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dots), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  gl.drawArrays(gl.POINTS, 0, dots.length / 2);
}