"use client";

import { CSSProperties, memo, useRef } from "react";
import { shallow } from "zustand/shallow";

import logo from "@/assets/logo_mark.jpg"

import { useStore, type ReactFlowState, type BackgroundProps } from "@xyflow/react";

const selector = (s: ReactFlowState) => ({ transform: s.transform });

interface CenteredImageBackgroundProps extends BackgroundProps {
    size?: number; // Base size of the image in pixels
}

function LogoBackground({
                                     size = 200, // Default size of the image
                                     style,
                                     className,
                                 }: CenteredImageBackgroundProps) {
    const ref = useRef<SVGSVGElement>(null);
    const { transform } = useStore(selector, shallow);

    const scaledSize = size * transform[2]; // Scale the size based on zoom level

    return (
        <svg
            className={"react-flow__background " + (className || "")}
            style={
                {
                    ...style,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    top: 0,
                    left: 0,
                } as CSSProperties
            }
            ref={ref}
            data-testid="rf__background"
        >
            <image
                href={logo.src}
                x={transform[0] + window.innerWidth / 2 - scaledSize / 2}
                y={transform[1] + window.innerHeight / 2 - scaledSize / 2}
                width={scaledSize}
                height={scaledSize}
                preserveAspectRatio="xMidYMid meet"
            />
        </svg>
    );
}

export default memo(LogoBackground);
