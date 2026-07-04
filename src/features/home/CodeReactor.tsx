import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useMemo, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Line } from '@react-three/drei'

// Parametric shape target position calculations
function getShapePos(
  side: 'left' | 'right',
  index: number,
  shapeType: 'angle' | 'square' | 'round' | 'curly'
): THREE.Vector3 {
  const t = index / 44 // 0 to 1
  let x = 0
  let y = 0
  let z = 0

  if (shapeType === 'angle') {
    // <> shape
    if (t <= 0.5) {
      const u = t / 0.5
      y = -1.2 * (1 - u)
      x = -0.5 - 0.95 * (1 - u)
    } else {
      const u = (t - 0.5) / 0.5
      y = 1.2 * u
      x = -0.5 - 0.95 * u
    }
  } else if (shapeType === 'square') {
    // [] shape
    if (t <= 0.2) {
      const u = t / 0.2
      y = -1.2
      x = -0.55 - 0.55 * u
    } else if (t <= 0.8) {
      const u = (t - 0.2) / 0.6
      y = -1.2 + 2.4 * u
      x = -1.1
    } else {
      const u = (t - 0.8) / 0.2
      y = 1.2
      x = -1.1 + 0.55 * u
    }
  } else if (shapeType === 'round') {
    // () shape
    const theta = -Math.PI / 3 + t * (2 * Math.PI / 3)
    y = 1.3 * Math.sin(theta)
    x = -0.45 - 0.85 * Math.cos(theta)
  } else if (shapeType === 'curly') {
    // {} shape
    if (t <= 0.5) {
      const u = t / 0.5
      y = -1.25 * (1 - u)
      x = -0.5 * Math.pow(1 - u, 3) +
          3 * (-0.7) * u * Math.pow(1 - u, 2) +
          3 * (-0.88) * u * u * (1 - u) +
          (-1.35) * Math.pow(u, 3)
    } else {
      const u = (t - 0.5) / 0.5
      y = 1.25 * u
      x = -1.35 * Math.pow(1 - u, 3) +
          3 * (-0.88) * u * Math.pow(1 - u, 2) +
          3 * (-0.7) * u * u * (1 - u) +
          (-0.5) * Math.pow(u, 3)
    }
  }

  // Right side is mirrored on X
  if (side === 'right') {
    x = -x
  }

  // Add a very small, subtle depth offset based on index to give it a 3D feeling
  z = Math.sin(t * Math.PI) * 0.05

  return new THREE.Vector3(x, y, z)
}

function Scene() {
  const mainGroupRef = useRef<THREE.Group>(null)
  
  // Refs for Left & Right Bracket parent groups
  const leftBracketRef = useRef<THREE.Group>(null)
  const rightBracketRef = useRef<THREE.Group>(null)

  // Refs for the 90 individual fragment meshes
  const leftMeshesRef = useRef<(THREE.Mesh | null)[]>([])
  const rightMeshesRef = useRef<(THREE.Mesh | null)[]>([])

  // Refs for the 4 orbiting symbol groups
  const orbitRefs = useRef<(THREE.Group | null)[]>([])

  // Refs for orbiting variables
  const orbitAnglesRef = useRef([0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2])
  const orbitDistFactorsRef = useRef([1.0, 1.0, 1.0, 1.0])
  const orbitScalesRef = useRef([1.0, 1.0, 1.0, 1.0])
  const orbitBrightnessRef = useRef([0.25, 0.25, 0.25, 0.25])

  // Reactor light ref
  const reactorLightRef = useRef<THREE.SpotLight>(null)

  // Dust particles and refs
  const dustRefs = useRef<(THREE.Mesh | null)[]>([])

  // Hover state (0: {}, 1: [], 2: (), 3: <>, null: none)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Interpolated expansion amount
  const expansionRef = useRef(0)

  // Generate 8 extruded 3D geometries for characters: <, >, {, }, [, ], (, )
  const geometries = useMemo(() => {
    const list: { [key: string]: THREE.ExtrudeGeometry } = {}
    const symbols = ['<', '>', '{', '}', '[', ']', '(', ')']
    
    symbols.forEach(sym => {
      const shape = new THREE.Shape()
      if (sym === '<') {
        shape.moveTo(0.12, 0.18)
        shape.lineTo(-0.12, 0.0)
        shape.lineTo(0.12, -0.18)
        shape.lineTo(0.12, -0.10)
        shape.lineTo(-0.04, 0.0)
        shape.lineTo(0.12, 0.10)
        shape.closePath()
      } else if (sym === '>') {
        shape.moveTo(-0.12, 0.18)
        shape.lineTo(0.12, 0.0)
        shape.lineTo(-0.12, -0.18)
        shape.lineTo(-0.12, -0.10)
        shape.lineTo(0.04, 0.0)
        shape.lineTo(-0.12, 0.10)
        shape.closePath()
      } else if (sym === '[') {
        shape.moveTo(0.08, 0.18)
        shape.lineTo(-0.08, 0.18)
        shape.lineTo(-0.08, -0.18)
        shape.lineTo(0.08, -0.18)
        shape.lineTo(0.08, -0.11)
        shape.lineTo(-0.01, -0.11)
        shape.lineTo(-0.01, 0.11)
        shape.lineTo(0.08, 0.11)
        shape.closePath()
      } else if (sym === ']') {
        shape.moveTo(-0.08, 0.18)
        shape.lineTo(0.08, 0.18)
        shape.lineTo(0.08, -0.18)
        shape.lineTo(-0.08, -0.18)
        shape.lineTo(-0.08, -0.11)
        shape.lineTo(0.01, -0.11)
        shape.lineTo(0.01, 0.11)
        shape.lineTo(-0.08, 0.11)
        shape.closePath()
      } else if (sym === '(') {
        shape.moveTo(0.06, 0.18)
        shape.quadraticCurveTo(-0.08, 0.0, 0.06, -0.18)
        shape.lineTo(0.12, -0.18)
        shape.quadraticCurveTo(-0.01, 0.0, 0.12, 0.18)
        shape.closePath()
      } else if (sym === ')') {
        shape.moveTo(-0.06, 0.18)
        shape.quadraticCurveTo(0.08, 0.0, -0.06, -0.18)
        shape.lineTo(-0.12, -0.18)
        shape.quadraticCurveTo(0.01, 0.0, -0.12, 0.18)
        shape.closePath()
      } else if (sym === '{') {
        shape.moveTo(0.08, 0.18)
        shape.lineTo(-0.02, 0.18)
        shape.quadraticCurveTo(-0.02, 0.08, -0.02, 0.06)
        shape.lineTo(-0.10, 0.0)
        shape.lineTo(-0.02, -0.06)
        shape.quadraticCurveTo(-0.02, -0.08, -0.02, -0.18)
        shape.lineTo(0.08, -0.18)
        shape.lineTo(0.08, -0.12)
        shape.lineTo(0.04, -0.12)
        shape.quadraticCurveTo(0.04, -0.04, 0.04, -0.02)
        shape.lineTo(-0.03, 0.0)
        shape.lineTo(0.04, 0.02)
        shape.quadraticCurveTo(0.04, 0.04, 0.04, 0.12)
        shape.lineTo(0.08, 0.12)
        shape.closePath()
      } else if (sym === '}') {
        shape.moveTo(-0.08, 0.18)
        shape.lineTo(0.02, 0.18)
        shape.quadraticCurveTo(0.02, 0.08, 0.02, 0.06)
        shape.lineTo(0.10, 0.0)
        shape.lineTo(0.02, -0.06)
        shape.quadraticCurveTo(0.02, -0.08, 0.02, -0.18)
        shape.lineTo(-0.08, -0.18)
        shape.lineTo(-0.08, -0.12)
        shape.lineTo(-0.04, -0.12)
        shape.quadraticCurveTo(-0.04, -0.04, -0.04, -0.02)
        shape.lineTo(0.03, 0.0)
        shape.lineTo(-0.04, 0.02)
        shape.quadraticCurveTo(-0.04, 0.04, -0.04, 0.12)
        shape.lineTo(-0.08, 0.12)
        shape.closePath()
      }
      
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.008,
        bevelThickness: 0.008
      })
      geo.center()
      list[sym] = geo
    })
    return list
  }, [])

  // Pre-generate fragment data for Left & Right Brackets
  const fragmentData = useMemo(() => {
    const allowed = ['<', '>', '{', '}', '[', ']', '(', ')']
    const createSide = (side: 'left' | 'right') => {
      return Array.from({ length: 45 }).map((_, i) => {
        const symbol = allowed[Math.floor(Math.random() * allowed.length)]
        const scale = 0.075 + Math.random() * 0.025
        const phase = Math.random() * Math.PI * 2
        
        // Expansion offset direction
        const t = i / 44
        const dy = t - 0.5
        const offsetDir = new THREE.Vector3(
          side === 'left' ? -0.85 : 0.85,
          dy * 0.5,
          (Math.random() - 0.5) * 0.15
        ).normalize()

        return {
          symbol,
          scale,
          phase,
          offsetDir,
          rotSpeed: 0.15 + Math.random() * 0.3,
          pos: new THREE.Vector3(),
          vel: new THREE.Vector3(),
          initialized: false
        }
      })
    }
    return {
      left: createSide('left'),
      right: createSide('right')
    }
  }, [])

  // Orbit path ring points
  const ringPoints = useMemo(() => {
    const pts = []
    const segments = 90
    const radiusX = 2.4
    const radiusY = 1.0
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      pts.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusY))
    }
    return pts
  }, [])

  // Faint ground anchor texture
  const baseGlowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.55)')
      gradient.addColorStop(0.5, 'rgba(96, 165, 250, 0.22)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Volumetric purple haze texture
  const hazeTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120)
      gradient.addColorStop(0, 'rgba(168, 85, 247, 0.65)')
      gradient.addColorStop(0.6, 'rgba(139, 92, 246, 0.25)')
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 256, 256)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Linear gradient texture for glass gradients
  const shardTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 128, 128)
      gradient.addColorStop(0, '#a855f7')
      gradient.addColorStop(1, '#3b82f6')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  // Dust particles data
  const dustParticles = useMemo(() => {
    return Array.from({ length: 8 }).map((_) => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 4.0,
        (Math.random() - 0.5) * 2.5,
        (Math.random() - 0.5) * 2.0
      ),
      speed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      ),
      phase: Math.random() * Math.PI * 2
    }))
  }, [])

  // Animation updates
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    const dt = Math.min(state.clock.getDelta(), 0.03)

    // ----------------------------------------------------
    // Y-axis slow rotation (-4° to +4° with 20s cycle)
    // ----------------------------------------------------
    if (mainGroupRef.current) {
      const cycle = (elapsed * Math.PI * 2) / 20
      mainGroupRef.current.rotation.y = Math.sin(cycle) * (4 * Math.PI / 180)
    }

    // ----------------------------------------------------
    // Left & Right Bracket separate breathing and floating
    // ----------------------------------------------------
    if (leftBracketRef.current) {
      const floatY = Math.sin(elapsed * 1.0) * 0.04
      const scale = 1.0 + Math.sin(elapsed * 0.8) * 0.015
      leftBracketRef.current.position.y = floatY
      leftBracketRef.current.scale.setScalar(scale)
    }
    if (rightBracketRef.current) {
      const floatY = Math.sin(elapsed * 1.2 + 1.0) * 0.04
      const scale = 1.0 + Math.sin(elapsed * 0.9 + 1.5) * 0.015
      rightBracketRef.current.position.y = floatY
      rightBracketRef.current.scale.setScalar(scale)
    }

    // ----------------------------------------------------
    // Spring Morphing & Magnetic Expansion Solver
    // ----------------------------------------------------
    const shapeType = 
      hoveredIndex === 0 ? 'curly' :
      hoveredIndex === 1 ? 'square' :
      hoveredIndex === 2 ? 'round' : 'angle'

    const targetExpansion = hoveredIndex !== null ? 0.08 : 0.0
    expansionRef.current += (targetExpansion - expansionRef.current) * 0.1

    const stiffness = 7.0
    const damping = 0.55

    // Left side particles spring update
    fragmentData.left.forEach((item, i) => {
      const mesh = leftMeshesRef.current[i]
      if (!mesh) return

      const basePos = getShapePos('left', i, shapeType)
      const tx = basePos.x + item.offsetDir.x * expansionRef.current
      const ty = basePos.y + item.offsetDir.y * expansionRef.current
      const tz = basePos.z + item.offsetDir.z * expansionRef.current

      if (!item.initialized) {
        item.pos.set(tx, ty, tz)
        item.initialized = true
      }

      const ax = stiffness * (tx - item.pos.x) - damping * item.vel.x
      const ay = stiffness * (ty - item.pos.y) - damping * item.vel.y
      const az = stiffness * (tz - item.pos.z) - damping * item.vel.z

      item.vel.x += ax * dt
      item.vel.y += ay * dt
      item.vel.z += az * dt

      item.pos.x += item.vel.x * dt
      item.pos.y += item.vel.y * dt
      item.pos.z += item.vel.z * dt

      const floatX = Math.sin(elapsed * 1.5 + item.phase) * 0.02
      const floatY = Math.cos(elapsed * 1.8 + item.phase * 1.2) * 0.03
      const floatZ = Math.sin(elapsed * 1.2 + item.phase * 0.8) * 0.01

      mesh.position.set(
        item.pos.x + floatX,
        item.pos.y + floatY,
        item.pos.z + floatZ
      )

      mesh.rotation.set(
        elapsed * item.rotSpeed * 0.2 + Math.sin(elapsed + item.phase) * 0.05,
        elapsed * item.rotSpeed * 0.3 + Math.cos(elapsed + item.phase) * 0.05,
        Math.sin(elapsed * 1.0 + item.phase) * 0.05
      )
    })

    // Right side particles spring update
    fragmentData.right.forEach((item, i) => {
      const mesh = rightMeshesRef.current[i]
      if (!mesh) return

      const basePos = getShapePos('right', i, shapeType)
      const tx = basePos.x + item.offsetDir.x * expansionRef.current
      const ty = basePos.y + item.offsetDir.y * expansionRef.current
      const tz = basePos.z + item.offsetDir.z * expansionRef.current

      if (!item.initialized) {
        item.pos.set(tx, ty, tz)
        item.initialized = true
      }

      const ax = stiffness * (tx - item.pos.x) - damping * item.vel.x
      const ay = stiffness * (ty - item.pos.y) - damping * item.vel.y
      const az = stiffness * (tz - item.pos.z) - damping * item.vel.z

      item.vel.x += ax * dt
      item.vel.y += ay * dt
      item.vel.z += az * dt

      item.pos.x += item.vel.x * dt
      item.pos.y += item.vel.y * dt
      item.pos.z += item.vel.z * dt

      const floatX = Math.sin(elapsed * 1.4 + item.phase) * 0.02
      const floatY = Math.cos(elapsed * 1.7 + item.phase * 1.1) * 0.03
      const floatZ = Math.sin(elapsed * 1.1 + item.phase * 0.7) * 0.01

      mesh.position.set(
        item.pos.x + floatX,
        item.pos.y + floatY,
        item.pos.z + floatZ
      )

      mesh.rotation.set(
        elapsed * item.rotSpeed * 0.2 + Math.sin(elapsed + item.phase * 1.1) * 0.05,
        elapsed * item.rotSpeed * 0.3 + Math.cos(elapsed + item.phase * 0.9) * 0.05,
        Math.sin(elapsed * 0.9 + item.phase) * 0.05
      )
    })

    // ----------------------------------------------------
    // Orbit Objects Update
    // ----------------------------------------------------
    const orbitAngles = orbitAnglesRef.current
    const distFactors = orbitDistFactorsRef.current
    const orbitScales = orbitScalesRef.current
    const orbitBrightness = orbitBrightnessRef.current

    for (let j = 0; j < 4; j++) {
      const isHovered = hoveredIndex === j

      // Update angle if not hovered (slow orbit: ~22s period)
      if (!isHovered) {
        orbitAngles[j] = (orbitAngles[j] + dt * (Math.PI * 2 / 22)) % (Math.PI * 2)
      }

      // Smoothly interpolate distance factor (closer if hovered)
      const targetDist = isHovered ? 0.6 : 1.0
      distFactors[j] += (targetDist - distFactors[j]) * 0.1

      // Smoothly interpolate scale
      const targetScale = isHovered ? 1.15 : 1.0
      orbitScales[j] += (targetScale - orbitScales[j]) * 0.1

      // Smoothly interpolate brightness
      const targetBright = isHovered ? 1.0 : 0.25
      orbitBrightness[j] += (targetBright - orbitBrightness[j]) * 0.1

      // Calculate position inside the tilted parent group
      const rx = 2.4 * distFactors[j]
      const rz = 1.0 * distFactors[j]
      const theta = orbitAngles[j]
      const ox = Math.cos(theta) * rx
      const oz = Math.sin(theta) * rz

      const orbitMesh = orbitRefs.current[j]
      if (orbitMesh) {
        orbitMesh.position.set(ox, 0, oz)
        orbitMesh.scale.setScalar(orbitScales[j])

        // Traverse child meshes to update material brightness
        orbitMesh.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mat = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial
            if (mat) {
              mat.emissiveIntensity = orbitBrightness[j]
              mat.opacity = 0.75 + (isHovered ? 0.25 : 0.0)
            }
          }
        })
      }
    }

    // ----------------------------------------------------
    // Volumetric Haze & Dust Particles slow movement
    // ----------------------------------------------------
    dustParticles.forEach((pt, index) => {
      const ref = dustRefs.current[index]
      if (!ref) return

      ref.position.x += pt.speed.x * dt
      ref.position.y += pt.speed.y * dt
      ref.position.z += pt.speed.z * dt

      if (Math.abs(ref.position.x) > 2.5) ref.position.x = -Math.sign(ref.position.x) * 2.5
      if (Math.abs(ref.position.y) > 1.8) ref.position.y = -Math.sign(ref.position.y) * 1.8
      if (Math.abs(ref.position.z) > 1.5) ref.position.z = -Math.sign(ref.position.z) * 1.5

      ref.position.y += Math.sin(elapsed * 0.4 + pt.phase) * 0.0005
    })
  })

  return (
    <group>
      {/* Soft fill ambient light */}
      <ambientLight intensity={0.15} color="#0f172a" />
      
      {/* Spotlight reactor core underneath pointing up (creates glow on base) */}
      <spotLight 
        ref={reactorLightRef}
        position={[0, -3.2, 0]} 
        angle={Math.PI / 3.0} 
        penumbra={0.85} 
        intensity={1.8} 
        color="#a855f7" 
      />
      
      {/* Key Light (Left): Vibrant Blue */}
      <directionalLight 
        position={[-5, 0.5, 3.5]} 
        intensity={3.0} 
        color="#60a5fa" 
      />
      
      {/* Fill Light (Right): Rich Purple/Violet */}
      <directionalLight 
        position={[5, -0.5, 3.5]} 
        intensity={3.0} 
        color="#c084fc" 
      />
      
      {/* Rim Light (Top/Back): Strong White Rim Light */}
      <directionalLight 
        position={[0, 7, -3.5]} 
        intensity={5.0} 
        color="#ffffff" 
      />

      {/* Volumetric Purple Haze behind the hero */}
      <mesh position={[0, 0, -2.5]}>
        <planeGeometry args={[7.0, 7.0]} />
        <meshBasicMaterial
          map={hazeTexture}
          transparent={true}
          opacity={0.04} // 4% opacity haze
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Subtle Ground Anchor Glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
        <planeGeometry args={[5.0, 5.0]} />
        <meshBasicMaterial 
          map={baseGlowTexture}
          transparent={true} 
          opacity={0.05} // 5% opacity circular glow
          depthWrite={false} 
          blending={THREE.AdditiveBlending} 
        />
      </mesh>

      {/* Maximum 8 tiny dust particles */}
      {dustParticles.map((pt, index) => (
        <mesh
          key={`dust-${index}`}
          ref={(el) => { dustRefs.current[index] = el }}
          position={[pt.pos.x, pt.pos.y, pt.pos.z]}
        >
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial
            color="#d8b4fe"
            transparent={true}
            opacity={0.15} // 15% opacity dust particles
          />
        </mesh>
      ))}

      {/* Main Assembly Group */}
      <group ref={mainGroupRef}>
        
        {/* Left Side Bracket assembly (Front-ish layer) */}
        <group ref={leftBracketRef}>
          {fragmentData.left.map((item, i) => (
            <mesh
              key={`l-${i}`}
              ref={(el) => { leftMeshesRef.current[i] = el }}
              geometry={geometries[item.symbol]}
              scale={item.scale}
            >
              <meshPhysicalMaterial
                map={shardTexture}
                transmission={0.9}
                roughness={0.1}
                ior={1.52}
                clearcoat={1.0}
                clearcoatRoughness={0.0}
                transparent={true}
                opacity={0.8}
                thickness={0.15}
              />
            </mesh>
          ))}
        </group>

        {/* Right Side Bracket assembly (Back-ish layer) */}
        <group ref={rightBracketRef}>
          {fragmentData.right.map((item, i) => (
            <mesh
              key={`r-${i}`}
              ref={(el) => { rightMeshesRef.current[i] = el }}
              geometry={geometries[item.symbol]}
              scale={item.scale}
            >
              <meshPhysicalMaterial
                map={shardTexture}
                transmission={0.9}
                roughness={0.1}
                ior={1.52}
                clearcoat={1.0}
                clearcoatRoughness={0.0}
                transparent={true}
                opacity={0.8}
                thickness={0.15}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* Orbit paths & Orbiting symbols */}
      <group rotation={[Math.PI / 18, 0, Math.PI / 12]}>
        {/* Path Line */}
        <Line
          points={ringPoints}
          color="#c084fc"
          lineWidth={0.8}
          dashed={true}
          dashSize={0.04}
          gapSize={0.16}
          transparent={true}
          opacity={0.05} // 5% opacity
        />

        {/* Orbit `{}` at index 0 */}
        <group 
          ref={(el) => { orbitRefs.current[0] = el }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredIndex(0)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            document.body.style.cursor = 'auto'
          }}
        >
          <mesh geometry={geometries['{']} position={[-0.12, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh geometry={geometries['}']} position={[0.12, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>

        {/* Orbit `[]` at index 1 */}
        <group 
          ref={(el) => { orbitRefs.current[1] = el }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredIndex(1)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            document.body.style.cursor = 'auto'
          }}
        >
          <mesh geometry={geometries['[']} position={[-0.1, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh geometry={geometries[']']} position={[0.1, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>

        {/* Orbit `()` at index 2 */}
        <group 
          ref={(el) => { orbitRefs.current[2] = el }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredIndex(2)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            document.body.style.cursor = 'auto'
          }}
        >
          <mesh geometry={geometries['(']} position={[-0.1, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh geometry={geometries[')']} position={[0.1, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>

        {/* Orbit `<>` at index 3 */}
        <group 
          ref={(el) => { orbitRefs.current[3] = el }}
          onPointerOver={(e) => {
            e.stopPropagation()
            setHoveredIndex(3)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            setHoveredIndex(null)
            document.body.style.cursor = 'auto'
          }}
        >
          <mesh geometry={geometries['<']} position={[-0.12, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
          <mesh geometry={geometries['>']} position={[0.12, 0, 0]}>
            <meshPhysicalMaterial
              map={shardTexture}
              transmission={0.9}
              roughness={0.1}
              ior={1.52}
              clearcoat={1.0}
              clearcoatRoughness={0.0}
              transparent={true}
              opacity={0.8}
              thickness={0.15}
              emissive={new THREE.Color('#9b5cff')}
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export function CodeReactor() {
  return (
    <div className="w-full h-full min-h-[300px] max-h-[350px] relative">
      <Canvas
        camera={{ position: [0, 0.0, 4.8], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
        {/* Bloom affects only crystal edges, particles, and reactor */}
        <EffectComposer>
          <Bloom 
            luminanceThreshold={0.4} 
            luminanceSmoothing={0.7} 
            intensity={0.25} 
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
