// app/marker/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ARPage from '@/components/ARPage';
import dynamic from 'next/dynamic';

export default function MarkerPage() {
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loadARScripts = async () => {
            // Load AFRAME
            const aframeScript = document.createElement('script');
            aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
            await new Promise((resolve) => {
                aframeScript.onload = resolve;
                document.body.appendChild(aframeScript);
            });

            // Load AR.js
            const arScript = document.createElement('script');
            arScript.src = 'https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js';
            await new Promise((resolve) => {
                arScript.onload = resolve;
                document.body.appendChild(arScript);
            });

            setIsClient(true);
        };

        loadARScripts();

        return () => {
            const scenes = document.querySelectorAll('a-scene');
            scenes.forEach(scene => scene.parentNode.removeChild(scene));

            // Hapus elemen <video> yang digunakan kamera
            const videos = document.querySelectorAll('video');
            videos.forEach(video => video.parentNode.removeChild(video));

            const scripts = document.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.src.includes('aframe.min.js') || script.src.includes('aframe-ar.js')) {
                    script.remove();
                }
            });
        };


    }, []);

    if (!isClient) {
        return <div className="flex items-center justify-center h-screen">Loading AR Experience...</div>;
    }

    return (
        <>
            <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
                renderer="logarithmicDepthBuffer: true;"
                vr-mode-ui="enabled: true"
            >
                <a-marker preset="hiro">
                    <a-entity
                        gltf-model="/object/marker-based/venus.glb"
                        scale="0.5 0.5 0.5"
                        position="0 0.5 -1.35"
                        rotation="0 45 0"
                        animation="property: rotation; to: 0 405 0; loop: true; dur: 10000"
                    ></a-entity>
                </a-marker>
                <a-entity camera></a-entity>
            </a-scene>

            {/* Back button */}
            <button
                onClick={() => router.push('/marker')}
                className="fixed top-4 left-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg opacity-80 hover:opacity-100"
            >
                Back
            </button>
        </>
    );
}