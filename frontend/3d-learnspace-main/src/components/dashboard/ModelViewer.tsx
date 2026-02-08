import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, MeshDistortMaterial, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Expand, RotateCcw, Layers, Tag, Download } from 'lucide-react';

function ModelPlaceholder() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1.5, 64, 64]}>
        <MeshDistortMaterial
          color="#6366f1"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

interface ModelViewerProps {
  modelName: string;
  subject: string;
  description?: string;
}

export function ModelViewer({ modelName, subject, description }: ModelViewerProps) {
  return (
    <div className="viewer-container h-full flex flex-col">
      {/* Viewer Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{modelName}</h3>
          <span className="subject-tag">{subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Tag className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Layers className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Expand className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#22d3ee" />
            <ModelPlaceholder />
            <Environment preset="studio" />
            <ContactShadows position={[0, -2, 0]} opacity={0.4} blur={2} />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              maxDistance={15}
              minDistance={3}
            />
          </Suspense>
        </Canvas>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="glass px-3 py-2 rounded-lg text-xs text-muted-foreground">
            Drag to rotate • Scroll to zoom • Shift+drag to pan
          </div>
          <Button variant="hero" size="sm">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Description Panel */}
      {description && (
        <div className="p-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">About this model</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      )}
    </div>
  );
}
