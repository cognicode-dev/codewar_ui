import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface CrystalFragmentProps {
  vertices: number[]
  indices: number[]
  colorGradient: [string, string]
  emissiveColor: string
  emissiveIntensity: number
  fragmentRef?: React.RefObject<THREE.Group | null>
}

export function CrystalFragment({
  vertices,
  indices,
  colorGradient,
  emissiveColor,
  emissiveIntensity,
  fragmentRef,
}: CrystalFragmentProps) {
  const outerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals() // Essential for beautiful lighting reflections
    return geo
  }, [vertices, indices])

  // Scale down slightly for the inner energy core
  const innerGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [vertices, indices])

  const innerCoreRef = useRef<THREE.Mesh>(null)

  // Subtle inner core flicker/breathing pulse
  useFrame((state) => {
    if (innerCoreRef.current) {
      const elapsed = state.clock.getElapsedTime()
      const pulse = 0.85 + Math.sin(elapsed * 4.5 + Math.random() * 0.2) * 0.1
      const mat = innerCoreRef.current.material as THREE.MeshBasicMaterial
      if (mat) {
        mat.opacity = pulse * 0.75
      }
    }
  })

  // CanvasTexture for gradient color and emissive map
  const gradientTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 256, 256)
      gradient.addColorStop(0, colorGradient[0]) // Violet
      gradient.addColorStop(1, colorGradient[1]) // Blue
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [colorGradient])

  return (
    <group ref={fragmentRef}>
      {/* Outer Physical Glass/Crystal Shell */}
      <mesh castShadow receiveShadow>
        <primitive object={outerGeo} attach="geometry" />
        <meshPhysicalMaterial
          map={gradientTexture}
          roughness={0.05}
          transmission={1.0}
          thickness={1.2} // Attains premium refraction depth
          ior={1.52} // Real glass refractive index
          clearcoat={1.0}
          clearcoatRoughness={0.0}
          envMapIntensity={1.5}
          attenuationDistance={2.0}
          attenuationColor="#9b5cff"
          emissive={new THREE.Color(emissiveColor)}
          emissiveIntensity={emissiveIntensity * 0.15} // Reduced to enhance reflection highlights
          emissiveMap={gradientTexture}
          transparent={true}
          opacity={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner Energy Core (Refracted inside the glass shell) */}
      <mesh ref={innerCoreRef} scale={[0.82, 0.82, 0.48]}>
        <primitive object={innerGeo} attach="geometry" />
        <meshBasicMaterial
          color="#d8b4fe"
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}
