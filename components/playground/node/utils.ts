import {MarkerType} from "@xyflow/react";

export const networkEdgeStyle = {
    style : {stroke: '#F17317', strokeWidth: 2},
    animated: true,
}

export const volumeEdgeStyle = {
    style : {stroke: '#40C65E', strokeWidth: 2},
    animated: false,
}

export const dependencyEdgeStyle = {
    style : {stroke: '#1C4ED8', strokeWidth: 2},
    animated: false,
    markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: '#1C4ED8',
    },
    label: 'depends_on',
    labelBgStyle: { fill: 'white', fillOpacity: 0.9 },
    labelBgPadding: [6, 6] as [number, number],
    labelStyle: { fill: '#1C4ED8', fontWeight: 500, fontSize: 12 },
}

export const envEdgeStyle = {
    style : {stroke: '#8B5CF6', strokeWidth: 2},
    animated: false,
}

export const labelEdgeStyle = {
    style : {stroke: '#F6339A', strokeWidth: 2},
    animated: false,
}
