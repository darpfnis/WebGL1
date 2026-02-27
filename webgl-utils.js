// ── webgl-utils.js ──
// Shared WebGL helpers used by all task scripts

export function setupWebGL(canvasId) {
  const canvas = document.getElementById(canvasId);
  const gl = canvas.getContext('webgl');
  if (!gl) {
    alert('WebGL не підтримується у вашому браузері.');
    return null;
  }
  gl.viewport(0, 0, canvas.width, canvas.height);
  return gl;
}

export function compileShader(gl, type, src) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

export function createProgram(gl, vsSrc, fsSrc) {
  const prog = gl.createProgram();
  gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER,   vsSrc));
  gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, fsSrc));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(`Program link error: ${gl.getProgramInfoLog(prog)}`);
  }
  return prog;
}