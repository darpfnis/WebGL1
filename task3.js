// ── task2.js ──
// Завдання 2: Кольоровий трикутник з унікальним кольором кожної вершини

import { setupWebGL, createProgram } from './webgl-utils.js';

export function task2() {
  const gl = setupWebGL('canvas2');
  if (!gl) return;

  // Vertex shader: receives position + color per vertex
  const vsSrc = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying   vec3 vColor;
    void main() {
      vColor      = aColor;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;

  // Fragment shader: outputs interpolated vertex color
  const fsSrc = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  const prog = createProgram(gl, vsSrc, fsSrc);
  gl.useProgram(prog);

  //  Interleaved buffer layout: [ x, y,  r, g, b ]
  const data = new Float32Array([
  //   x      y      r     g     b
     0.00,  0.72,  0.98, 0.71, 0.71,  // top    — pastel red / pink
    -0.62, -0.60,  0.98, 0.86, 0.74,  // left   — pastel peach
     0.62, -0.60,  0.74, 0.82, 0.98,  // right  — pastel blue
  ]);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const STRIDE = 5 * Float32Array.BYTES_PER_ELEMENT;

  const aPos = gl.getAttribLocation(prog, 'aPosition');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, STRIDE, 0);

  const aCol = gl.getAttribLocation(prog, 'aColor');
  gl.enableVertexAttribArray(aCol);
  gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, STRIDE, 2 * Float32Array.BYTES_PER_ELEMENT);

  gl.clearColor(0.165, 0.153, 0.145, 1.0); // --grey-900
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}