'use client';

import { useEffect, useState, useRef, Suspense } from "react";
import { Translator } from "@composecraft/docker-compose-lib";
import { getComposeByIdPublic } from "@/actions/userActions";
import { composeMetadata, recreatePositionMap, reHydrateComposeIds } from "@/lib/metadata";
import { useComposeStore } from "@/store/compose";
import usePositionMap from "@/store/metadataMap";
import useDisableStateStore from "@/store/disabled";
import Playground, { PlaygroundHandle } from "@/components/playground/playground";
import '@xyflow/react/dist/style.css';

interface ExportRenderContentProps {
    id: string;
}

function ExportRenderContentInner({ id }: ExportRenderContentProps) {
    const { replaceCompose } = useComposeStore();
    const { setPositionMap } = usePositionMap();
    const { setState } = useDisableStateStore();
    const playgroundRef = useRef<PlaygroundHandle>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Disable save state
        setState(true);

        const loadCompose = async () => {
            try {
                const result = await getComposeByIdPublic(id);
                
                if (!result || !result.data) {
                    setError('Compose not found');
                    setIsLoading(false);
                    return;
                }

                const metadata: composeMetadata = result.metadata;
                const data = result.data;

                if (data) {
                    const savedCompose = Translator.fromDict(data);
                    if (metadata) {
                        reHydrateComposeIds(savedCompose, metadata);
                        setPositionMap(recreatePositionMap(metadata.positionMap));
                    }
                    replaceCompose(savedCompose, { disableSave: true });
                    
                    // Trigger layout if no metadata
                    if (!metadata) {
                        setTimeout(() => {
                            playgroundRef.current?.onLayout("TB");
                        }, 500);
                    }

                    // Wait a bit for the playground to render, then signal ready
                    setTimeout(() => {
                        setIsLoading(false);
                        // Signal to puppeteer that we're ready
                        if (typeof window !== 'undefined') {
                            (window as any).__PLAYGROUND_READY__ = true;
                        }
                    }, 1000);
                } else {
                    setError('No data found');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error loading compose:', err);
                setError('Failed to load compose');
                setIsLoading(false);
            }
        };

        loadCompose();
    }, [id, replaceCompose, setPositionMap, setState]);

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    return (
        <div
            style={{
                width: '100vw',
                height: '100vh',
                margin: 0,
                padding: 0,
                overflow: 'hidden',
                background: '#FFFF00' // Unique yellow color for background removal in export
            }}
        >
            {!isLoading && (
                <Playground ref={playgroundRef} hideControlsByDefault={true} />
            )}
        </div>
    );
}

export default function ExportRenderContent({ id }: ExportRenderContentProps) {
    return (
        <Suspense fallback={<div style={{ width: '100vw', height: '100vh', background: '#FFFF00' }} />}>
            <ExportRenderContentInner id={id} />
        </Suspense>
    );
}
