import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Stage, OrbitControls, useGLTF, Html, useProgress } from "@react-three/drei";
import { Loader2 } from "lucide-react";

function Model({ url }: { url: string }) {
    const { scene } = useGLTF(url);
    return <primitive object={scene} />;
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-2 text-primary font-bold bg-background/80 p-4 rounded-xl backdrop-blur-md border border-primary/20">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>{progress.toFixed(0)}% loaded</span>
            </div>
        </Html>
    );
}

interface ModelViewerProps {
    url: string;
}

export default function ModelViewer({ url }: ModelViewerProps) {
    // Ensure URL is absolute/correct if receiving relative paths
    const fullUrl = url.startsWith("http") ? url : `http://127.0.0.1:8000${url}`;

    return (
        <div className="w-full h-full min-h-[500px] bg-gradient-to-b from-gray-900 to-black rounded-xl overflow-hidden relative">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={<Loader />}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={fullUrl} />
                    </Stage>
                </Suspense>
                <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <div className="absolute bottom-4 right-4 text-xs text-white/30 pointer-events-none">
                Wait for load • Left click to rotate • Scroll to zoom
            </div>
        </div>
    );
}
