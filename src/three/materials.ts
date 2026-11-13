import * as THREE from 'three';

/* Shared, cached materials so scenes reuse GPU programs and stay light on draw state. */
const cache = new Map<string, THREE.Material>();

export function std(color: string, roughness = 0.62, metalness = 0, extra?: Partial<THREE.MeshStandardMaterialParameters>) {
  const key = `s|${color}|${roughness}|${metalness}|${extra ? JSON.stringify(extra) : ''}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
    cache.set(key, m);
  }
  return m as THREE.MeshStandardMaterial;
}

export function glossy(color: string, roughness = 0.25) {
  const key = `g|${color}|${roughness}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshPhysicalMaterial({ color, roughness, clearcoat: 1, clearcoatRoughness: 0.15 });
    cache.set(key, m);
  }
  return m as THREE.MeshPhysicalMaterial;
}

/** Translucent jelly for ice-pop liquid (cheap: no transmission pass). */
export function jelly(color: string, frozen = false) {
  const key = `j|${color}|${frozen}`;
  let m = cache.get(key);
  if (!m) {
    const c = new THREE.Color(color);
    m = new THREE.MeshPhysicalMaterial({
      color: c,
      roughness: frozen ? 0.55 : 0.12,
      clearcoat: 1,
      clearcoatRoughness: frozen ? 0.6 : 0.05,
      transparent: true,
      opacity: frozen ? 0.98 : 0.93,
      emissive: c.clone().multiplyScalar(0.28),
      sheen: frozen ? 0.4 : 0,
      sheenColor: new THREE.Color('#ffffff'),
    });
    cache.set(key, m);
  }
  return m as THREE.MeshPhysicalMaterial;
}

export function film() {
  const key = 'film';
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.1, clearcoat: 1, depthWrite: false });
    cache.set(key, m);
  }
  return m as THREE.MeshPhysicalMaterial;
}

export function emissive(color: string, intensity = 1.2) {
  const key = `e|${color}|${intensity}`;
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, roughness: 0.4 });
    cache.set(key, m);
  }
  return m as THREE.MeshStandardMaterial;
}

export function textured(tex: THREE.Texture, opts?: Partial<THREE.MeshStandardMaterialParameters>) {
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, ...opts });
}

export const FLAVOURS = [
  { id: 'raspberry', name: 'Raspberry', color: '#c2185b' },
  { id: 'lemon', name: 'Lemon', color: '#b5d63a' },
  { id: 'orange', name: 'Orange', color: '#ff7a1a' },
  { id: 'bubblegum', name: 'Bubble Gum', color: '#ff5fa8' },
  { id: 'cola', name: 'Cola', color: '#6b2a18' },
  { id: 'mango', name: 'Mango', color: '#ffb000' },
];
