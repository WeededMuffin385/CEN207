import {useEffect, useRef, useState, type PointerEvent} from "react";
import {RotateCcw} from "lucide-react";
import styles from "./product.module.css";

export type Product3DViewerProps = {
    productId: string;
    modelUrl?: string;
    posterUrl?: string;
    alt: string;
};

export default function Product3DViewer({productId, modelUrl, posterUrl, alt}: Product3DViewerProps) {
    const [rotation, setRotation] = useState({x: -14, y: 28});
    const [isVisible, setIsVisible] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{x: number; y: number; rotationX: number; rotationY: number} | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {rootMargin: "100px"});
        observer.observe(root);
        return () => observer.disconnect();
    }, []);

    function startDrag(event: PointerEvent<HTMLDivElement>) {
        dragRef.current = {x: event.clientX, y: event.clientY, rotationX: rotation.x, rotationY: rotation.y};
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function drag(event: PointerEvent<HTMLDivElement>) {
        const start = dragRef.current;
        if (!start) return;
        setRotation({x: Math.max(-70, Math.min(70, start.rotationX - (event.clientY - start.y) * .35)), y: start.rotationY + (event.clientX - start.x) * .45});
    }

    const transform = `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`;

    return (
        <section className={styles.ViewerSection} aria-labelledby={`viewer-${productId}`}>
            <div className={styles.ViewerHeading}>
                <div><span>Interactive preview</span><h2 id={`viewer-${productId}`}>View it from every angle</h2></div>
                <button type="button" onClick={() => setRotation({x: -14, y: 28})}><RotateCcw size={18}/> Reset view</button>
            </div>
            <div ref={rootRef} className={styles.Viewer} role="img" aria-label={`${alt}. Drag left or right to rotate the placeholder model.`}
                 tabIndex={0} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={() => dragRef.current = null} onPointerCancel={() => dragRef.current = null}>
                {posterUrl && <img className={styles.ViewerPoster} src={posterUrl} alt=""/>}
                <div className={styles.Scene} aria-hidden="true">
                    {isVisible && <div className={styles.Model} style={{transform}} data-model-url={modelUrl}>
                        <i/><i/><i/><i/><i/><i/>
                    </div>}
                    <div className={styles.ModelShadow}/>
                </div>
                <p className={styles.ViewerInstructions}>Drag to rotate · Temporary 3D model</p>
            </div>
            {/* Integration boundary: replace the CSS model with a product-specific GLB/GLTF renderer when modelUrl is supplied. */}
        </section>
    );
}
