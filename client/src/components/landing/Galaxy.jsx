import { useRef, useEffect } from 'react';
import { Renderer, Camera, Transform, Program, Mesh, Geometry } from 'ogl';

export default function Galaxy({ density = 1.2, glowIntensity = 0.2, hueShift = 20, starSpeed = 0.3, transparent = true }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      width: window.innerWidth,
      height: window.innerHeight,
      alpha: transparent,
      premultipliedAlpha: false
    });
    renderer.gl.clearColor(0, 0, 0, 0);
    container.appendChild(renderer.gl.canvas);

    const camera = new Camera(renderer.gl, { fov: 35 });
    camera.position.z = 5;

    const scene = new Transform();

    // Create particles
    const particleCount = Math.floor(2000 * density);
    const position = new Float32Array(particleCount * 3);
    const randoms = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Spiral or spherical random spread
      const radius = Math.random() * Math.random() * 3 + 0.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      position[i * 3 + 0] = radius * Math.cos(theta) * Math.cos(phi);
      position[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // flatter disk
      position[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      randoms[i * 3 + 0] = Math.random();
      randoms[i * 3 + 1] = Math.random();
      randoms[i * 3 + 2] = Math.random();

      // Midnight & Blaze Colors: Deep orange/red mix, with some graphite
      const isBlaze = Math.random() > 0.6;
      if (isBlaze) {
        colors[i * 3 + 0] = 1.0; // r: 255
        colors[i * 3 + 1] = 0.36 + Math.random() * 0.1; // g: 92 ~ 118
        colors[i * 3 + 2] = 0.0; // b: 0
      } else {
        colors[i * 3 + 0] = 0.3;
        colors[i * 3 + 1] = 0.3;
        colors[i * 3 + 2] = 0.3;
      }
    }

    const geometry = new Geometry(renderer.gl, {
      position: { size: 3, data: position },
      random: { size: 3, data: randoms },
      color: { size: 3, data: colors }
    });

    const program = new Program(renderer.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec3 random;
        attribute vec3 color;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uTime;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            vec3 pos = position;
            // simple rotation
            float angle = uTime * ${starSpeed.toFixed(4)} * (1.0 + random.x) * 0.1;
            float c = cos(angle);
            float s = sin(angle);
            pos.x = position.x * c - position.z * s;
            pos.z = position.z * c + position.x * s;
            
            vColor = color;
            vAlpha = (0.3 + random.y * 0.7) * ${glowIntensity.toFixed(4)};

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = (random.z * 3.0 + 1.0) * (5.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragment: `
        precision highp float;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if(dist > 0.5) discard;
            float g = 1.0 - (dist * 2.0);
            gl_FragColor = vec4(vColor, vAlpha * g);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
      depthTest: false,
    });

    const mesh = new Mesh(renderer.gl, { mode: renderer.gl.POINTS, geometry, program });
    mesh.setParent(scene);

    let animationFrame;
    const update = (t) => {
      animationFrame = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      
      // Slight tilt
      scene.rotation.x = 0.5;
      scene.rotation.y += 0.001;

      renderer.render({ scene, camera });
    };
    animationFrame = requestAnimationFrame(update);

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.perspective({ aspect: renderer.gl.canvas.width / renderer.gl.canvas.height });
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrame);
      if (container) container.removeChild(renderer.gl.canvas);
    };
  }, [density, glowIntensity, hueShift, starSpeed, transparent]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0" 
      style={{ overflow: 'hidden' }}
    />
  );
}