"use client"

import {CSSProperties, memo, useRef} from 'react';
import { shallow } from 'zustand/shallow';

import { useStore, type ReactFlowState, type BackgroundProps } from '@xyflow/react';
import SvgComponent from "@/assets/logo";

const selector = (s: ReactFlowState) => ({ transform: s.transform, patternId: `pattern-${s.rfId}` });

function Background({
                        id,
                        gap = 150,
                        size,
                        offset = 2,
                        style,
                        className,
                    }: BackgroundProps) {
    const ref = useRef<SVGSVGElement>(null);
    const { transform, patternId } = useStore(selector, shallow);
    const patternSize = size || 1;
    const gapXY: [number, number] = Array.isArray(gap) ? gap : [gap, gap];
    const scaledGap: [number, number] = [gapXY[0] * transform[2] || 1, gapXY[1] * transform[2] || 1];
    const scaledSize = patternSize * transform[2];

    const patternOffset = [scaledSize / Number(offset), scaledSize / Number(offset)]

    const _patternId = `${patternId}${id ? id : ''}`;

    return (
        <svg
            className={"react-flow__background "+className}
            style={
                {
                    ...style,
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                } as CSSProperties
            }
            ref={ref}
            data-testid="rf__background"
        >
            <pattern
                id={_patternId}
                x={transform[0] % scaledGap[0]}
                y={transform[1] % scaledGap[1]}
                width={scaledGap[0]}
                height={scaledGap[1]}
                patternUnits="userSpaceOnUse"
                patternTransform={`translate(-${patternOffset[0]},-${patternOffset[1]})`}
            >
                <SvgComponent opacity={0.5} width="64" height="64"  style={{
                    transform: `scale(${transform[2]})`
                }} />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${_patternId})`} />
        </svg>
    );
}
export default memo(Background);