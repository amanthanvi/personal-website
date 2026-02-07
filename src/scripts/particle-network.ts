import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BufferGeometry,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  LineSegments,
  LineBasicMaterial,
  Color,
} from 'three';

// Section accent colors (matching CSS oklch → hex approximations for Three.js)
const SECTION_COLORS = [
  { offset: 0, color: new Color('#00d4ff') },     // hero: cyan
  { offset: 0.2, color: new Color('#22c55e') },   // projects: green
  { offset: 0.4, color: new Color('#f59e0b') },   // experience: amber
  { offset: 0.6, color: new Color('#d946ef') },   // skills: magenta
  { offset: 0.8, color: new Color('#3b82f6') },   // blog: blue
  { offset: 1.0, color: new Color('#3b82f6') },   // end
];

const PARTICLE_COUNT = 90;
const CONNECTION_DISTANCE = 2.5;
const MOUSE_INFLUENCE = 0.3;

interface ParticleData {
  velocity: Float32Array;
}

function getScrollProgress(): number {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  return docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
}

function getColorForScroll(progress: number): Color {
  for (let i = 0; i < SECTION_COLORS.length - 1; i++) {
    const curr = SECTION_COLORS[i];
    const next = SECTION_COLORS[i + 1];
    if (progress >= curr.offset && progress <= next.offset) {
      const t = (progress - curr.offset) / (next.offset - curr.offset);
      return curr.color.clone().lerp(next.color, t);
    }
  }
  return SECTION_COLORS[0].color.clone();
}

export function initParticleNetwork(canvas: HTMLCanvasElement): (() => void) | null {
  // Bail on reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const scene = new Scene();
  const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create particle positions
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const data: ParticleData = { velocity: new Float32Array(PARTICLE_COUNT * 3) };

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 8;
    positions[i3 + 1] = (Math.random() - 0.5) * 8;
    positions[i3 + 2] = (Math.random() - 0.5) * 4;

    data.velocity[i3] = (Math.random() - 0.5) * 0.005;
    data.velocity[i3 + 1] = (Math.random() - 0.5) * 0.005;
    data.velocity[i3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  // Points
  const pointGeo = new BufferGeometry();
  pointGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));

  const pointMat = new PointsMaterial({
    size: 0.04,
    color: SECTION_COLORS[0].color,
    transparent: true,
    opacity: 0.7,
  });

  const points = new Points(pointGeo, pointMat);
  scene.add(points);

  // Lines
  const lineGeo = new BufferGeometry();
  const lineMat = new LineBasicMaterial({
    color: SECTION_COLORS[0].color,
    transparent: true,
    opacity: 0.15,
  });
  const lines = new LineSegments(lineGeo, lineMat);
  scene.add(lines);

  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;

  const onMouseMove = (e: MouseEvent) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  };

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Resize
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', onResize, { passive: true });

  // Animation loop
  let animId: number;
  let lastTime = 0;

  const animate = (time: number) => {
    animId = requestAnimationFrame(animate);

    // Frame budget: skip if too fast (cap at ~30fps for perf)
    if (time - lastTime < 33) return;
    lastTime = time;

    const posAttr = pointGeo.getAttribute('position') as Float32BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    // Update positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      posArray[i3] += data.velocity[i3];
      posArray[i3 + 1] += data.velocity[i3 + 1];
      posArray[i3 + 2] += data.velocity[i3 + 2];

      // Wrap around bounds
      for (let j = 0; j < 3; j++) {
        const bound = j === 2 ? 2 : 4;
        if (posArray[i3 + j] > bound) posArray[i3 + j] = -bound;
        if (posArray[i3 + j] < -bound) posArray[i3 + j] = bound;
      }
    }

    posAttr.needsUpdate = true;

    // Update connections
    const linePositions: number[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      for (let j = i + 1; j < PARTICLE_COUNT; j++) {
        const dx = posArray[i * 3] - posArray[j * 3];
        const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
        const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONNECTION_DISTANCE) {
          linePositions.push(
            posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
            posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2],
          );
        }
      }
    }

    lineGeo.setAttribute(
      'position',
      new Float32BufferAttribute(linePositions, 3),
    );

    // Color based on scroll position
    const scrollColor = getColorForScroll(getScrollProgress());
    pointMat.color.copy(scrollColor);
    lineMat.color.copy(scrollColor);

    // Subtle mouse parallax
    camera.position.x += (mouseX * MOUSE_INFLUENCE - camera.position.x) * 0.02;
    camera.position.y += (mouseY * MOUSE_INFLUENCE - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  animId = requestAnimationFrame(animate);

  // Cleanup
  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    renderer.dispose();
    pointGeo.dispose();
    pointMat.dispose();
    lineGeo.dispose();
    lineMat.dispose();
  };
}
