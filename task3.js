// ── task3.js ──
// Завдання 3: Прямокутник із двох трикутників, обертання через requestAnimationFrame

import { setupWebGL, createProgram } from './webgl-utils.js';

export function task3() {
  const gl = setupWebGL('canvas3');
  if (!gl) return;

  const vsSrc = `
    precision mediump float; // ДОДАЙТЕ ЦЕЙ РЯДОК
    attribute vec2 aPosition;
    uniform float uAngle;
    void main() {
      float c = cos(uAngle);
      float s = sin(uAngle);
      vec2 rotated = vec2(
        c * aPosition.x - s * aPosition.y,
        s * aPosition.x + c * aPosition.y
      );
      gl_Position = vec4(rotated, 0.0, 1.0);
    }
  `;

  const fsSrc = `
    precision mediump float;
    uniform float uAngle;
    void main() {
      float t = sin(uAngle * 0.5) * 0.5 + 0.5;
      gl_FragColor = vec4(0.96, 0.71 + t * 0.12, 0.71 + t * 0.12, 1.0);
    }
  `;

  const prog = createProgram(gl, vsSrc, fsSrc);
  gl.useProgram(prog);

  // Rectangle = 2 triangles, centered at (0, 0)
  const h = 0.38;
  const verts = new Float32Array([
    -h,  h,   -h, -h,    h, -h,   // triangle 1
    -h,  h,    h, -h,    h,  h,   // triangle 2
  ]);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uAngle = gl.getUniformLocation(prog, 'uAngle');

  let angle = 0;
  let lastTs = null;

  function render(ts) {
    if (lastTs !== null) angle += (ts - lastTs) * 0.0012;
    lastTs = ts;

    gl.clearColor(0.165, 0.153, 0.145, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uAngle, angle);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
