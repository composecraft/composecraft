import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react";
import {
    Node,
    XYPosition,
    Dimensions,
    Edge, OnSelectionChangeParams, EdgeChange, Controls, Background, BackgroundVariant,
    ReactFlow,
} from "@xyflow/react";
import {useComposeStore} from "@/store/compose";
import ServiceNode from "@/components/playground/node/serviceNode";
import NetworkNode from "@/components/playground/node/networkNode";
import {Binding, Compose, Env, SuperSet, Volume} from "@composecraft/docker-compose-lib";
import {dependencyEdgeStyle, envEdgeStyle, networkEdgeStyle, volumeEdgeStyle,labelEdgeStyle} from "@/components/playground/node/utils";
import ELK from 'elkjs/lib/elk.bundled.js';

import '@xyflow/react/dist/style.css'
import useSelectionStore from "@/store/selection";
import VolumeNode from "@/components/playground/node/volumeNode";
import BindingNode from "@/components/playground/node/bindingNode";
import EnvNode from "@/components/playground/node/envNode";
import usePositionMap from "@/store/metadataMap";
import {handleBackspacePress} from "./playgroundUtils";
import LabelNode from "./node/labelNode";

export type NodeData = {
    position: XYPosition,
    dimension?: Dimensions
}

export interface PlaygroundHandle {
    onLayout: (direction: string) => void;
}

const Playground = forwardRef<PlaygroundHandle>((_, ref) => {

    const {compose, setCompose} = useComposeStore();
    const [select, setSelect] = useState("")
    const {positionMap, setPositionMap} = usePositionMap()
    const {setSelectedString} = useSelectionStore()
    const [isDraggable, setIsDraggable] = useState(true)

    const updatePosition = useCallback((key: string, newPosition: XYPosition) => {
        const currentEntry = positionMap.get(key);
        if (currentEntry?.position === newPosition) {
            return
        }
        const updatedMap = new Map(positionMap);
        updatedMap.set(key, {
            position: newPosition,
            dimension: currentEntry?.dimension
        });
        setPositionMap(updatedMap);
    }, [positionMap, setPositionMap]);

    useEffect(() => {
        compose.services.forEach((service) => {
            if (!positionMap.has(service.id)) {
                positionMap.set(service.id,
                    {
                        position: {x: 0, y: 0},
                    })
            }
        })
    }, [compose, positionMap]);

    const nodeTypes = useMemo(() => (
        {
            service: ServiceNode,
            network: NetworkNode,
            volume: VolumeNode,
            binding: BindingNode,
            env: EnvNode,
            label: LabelNode
        }
    ), [])

    const elk = new ELK();
        const defaultOptions = {
            'elk.algorithm': 'force',
            'elk.force.iterations': '300',
            'elk.force.repulsivePower': '0.5',
            'elk.force.attractivePower': '0.3',
            'elk.spacing.nodeNode': '40',
            'elk.spacing.componentComponent': '30',
            'elk.force.temperature': '0.1',
            'elk.force.gravityConstant': '0.2',
            'elk.force.minDistanceConstant': '2',
            'elk.portConstraints': 'FIXED_SIDE',
            'elk.ports.fixedSide': 'WEST'
        };

        function onLayout() {
            // First ensure all nodes are in the DOM and measured
            const nodes = composeToNodes(compose);

            // Wait a tick for DOM to update
            setTimeout(() => {
                const graph = {
                    id: 'root',
                    layoutOptions: defaultOptions,
                    children: nodes.map((node) => {
                        const element = window.document.getElementById(node.id);
                        const width = element?.offsetWidth || 200;  // Increased default size
                        const height = element?.offsetHeight || 200;
                                return {
                                    id: node.id,
                                    width,
                                    height,
                                    x: node.position.x,
                                    y: node.position.y,
                                };
                    }),
                    edges: composeToEdge(compose).map((edge) => ({
                        id: edge.id,
                        sources: [edge.source],
                        targets: [edge.target]
                    }))
                };

                elk.layout(graph).then(({children}) => {
                    if (children) {
                        // Create a batch of all position updates
                        const updates = new Map();
                        children.forEach((node) => {
                            updates.set(node.id, {
                                position: {
                                    x: node.x || 0,
                                    y: node.y || 0
                                }
                            });
                        });

                        // Apply all updates at once
                        setPositionMap(updates);
                    }
                }).catch(error => {
                    console.error('ELK layout error:', error);
                });
            }, 0);
        }


useImperativeHandle(ref, () => ({
    onLayout
}));

const onNodesChanges = useCallback(
    // eslint-disable-next-line
    (changes: any[]) => {
        if(!isDraggable) {
            return;
        }

        changes.forEach((change) => {
            if (change?.type === "position") {
                if (change?.position?.x && change?.position?.y) {
                    //console.log(change.position)
                    updatePosition(change.id, change.position)
                }
            }
        })
    },
    [updatePosition, isDraggable]
)

// eslint-disable-next-line
function onNodesConnect(params: any) {
    //console.log('connect',params)
    if (params.sourceHandle === "network") {
        setCompose((compose) => {
            const service = compose.services.get("id", params.source)
            const network = compose.networks.get("id", params.target)
            if (service && network) {
                service.networks.add(network)
            }
        })
    } else if (params.sourceHandle === "service") {
        setCompose((compose) => {
            const source = compose.services.get("id", params.source)
            const target = compose.services.get("id", params.target)
            if (source && target) {
                source.depends_on.add(target)
            }
        })
    } else if (params.sourceHandle === "volume") {
        setCompose((compose) => {
            const service = compose.services.get("id", params.source)
            const volume = compose.volumes.get("id", params.target)
            if (service && volume) {
                service.bindings.add(new Binding({
                    source: volume,
                    target: ""
                }))
            }
        })
    } else if (params.sourceHandle === "env") {
        setCompose((compose) => {
            const service = compose.services.get("id", params.source)
            const env = compose.envs.get("id", params.target)
            if (service && env) {
                const environement = service.environment
                if (environement) {
                    environement.add(env)
                } else {
                    service.environment = new SuperSet<Readonly<Env>>()
                    service.environment.add(env)
                }
            }
        })
    }
}

function composeToNodes(compose: Compose): Node[] {
    const result: Node[] = []
    compose.services.forEach((service) => {
        result.push({
            id: service.id,
            position: positionMap.get(service.id)?.position || {x: 10, y: 10},
            type: "service",
            data: {service},
            draggable: true
        } as Node)
        service.bindings.forEach((binding) => {
            if (!Object.prototype.hasOwnProperty.call(binding.source, "id")) {
                result.push({
                    id: binding.id,
                    position: positionMap.get(binding.id)?.position || {x: 10, y: 10},
                    type: "binding",
                    data: {binding},
                    draggable: true
                } as Node)
            }
        })
        service.labels?.forEach(label=>{
            result.push({
                id: label.id,
                position: positionMap.get(label.id)?.position || {x: 10, y: 10},
                type: "label",
                data: {label},
                draggable: true
        })
        })
    })
    compose.networks.forEach((network) => result.push({
        id: network.id,
        position: positionMap.get(network.id)?.position || {x: 10, y: 10},
        type: "network",
        data: {network},
        draggable: true
    }))
    compose.volumes.forEach((volume) => {
        result.push({
            id: volume.id,
            position: positionMap.get(volume.id)?.position || {x: 10, y: 10},
            type: "volume",
            data: {volume},
            draggable: true
        })
    })
    compose.envs.forEach((env) => {
        result.push({
            id: env.id,
            position: positionMap.get(env.id)?.position || {x: 10, y: 10},
            type: "env",
            data: {env},
            draggable: true
        })
    })
    return result;
}

function composeToEdge(compose: Compose): Edge[] {
    const result: Edge[] = []
    compose.services.forEach((service) => {
        service.networks.forEach((network) => {
            result.push({
                id: "edg-" + network.id + service.id,
                source: service.id,
                target: network.id,
                sourceHandle: 'network',
                targetHandle: 'network',
                ...networkEdgeStyle
            } as Edge)
        })
        service.labels?.forEach(label=>{
            result.push({
                id: "edg-" + label.id + service.id,
                source: service.id,
                target: label.id,
                sourceHandle: 'label',
                targetHandle: 'label',
                ...labelEdgeStyle
            } as Edge)
        })
        service.bindings.forEach((binding) => {
            if (!Object.prototype.hasOwnProperty.call(binding.source, "id")) {
                result.push({
                    id: "edg-" + binding.id + service.id,
                    source: service.id,
                    target: binding.id,
                    sourceHandle: 'volume',
                    targetHandle: 'volume',
                    ...volumeEdgeStyle
                } as Edge)
            } else {
                const vol = binding.source as Volume
                result.push({
                    id: "edg-" + vol.id + service.id,
                    source: service.id,
                    target: vol.id,
                    sourceHandle: 'volume',
                    targetHandle: 'volume',
                    ...volumeEdgeStyle
                } as Edge)
            }
        })
        service.depends_on.forEach((targetService) => {
            result.push({
                id: "edg-" + targetService.id + service.id,
                source: service.id,
                target: targetService.id,
                sourceHandle: 'service',
                targetHandle: 'service',
                ...dependencyEdgeStyle
            } as Edge)
        })
        service.environment?.forEach((targetEnv) => {
            result.push({
                id: "edg-" + targetEnv.id + service.id,
                source: service.id,
                target: targetEnv.id,
                sourceHandle: 'env',
                targetHandle: 'env',
                ...envEdgeStyle
            } as Edge)
        })
    })
    return result
}

function handleSelection(data: OnSelectionChangeParams | EdgeChange[]) {
    if (Object.prototype.hasOwnProperty.call(data, "nodes")) {
        const selectionParam = data as OnSelectionChangeParams
        if ((selectionParam.nodes.length >= 1)) {
            setSelect(selectionParam.nodes[0].id)
        }
    } else {
        // eslint-disable-next-line
        const edgeChange = (data as any[])[0]
        if (edgeChange) {
            setSelect(edgeChange.id)
        }
    }
}

function handleKeyPress(event: KeyboardEvent) {
    const keyPressed = event.key;

    // Handle specific keys
    switch (keyPressed) {
        case 'Backspace':
        case 'Delete':
            handleBackspacePress(select,setCompose,setSelectedString)
            break;
        default:
            //console.log(`${keyPressed} key pressed`);
            break;
    }
}

return (
    <ReactFlow
        nodes={composeToNodes(compose)}
        edges={composeToEdge(compose)}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChanges}
        onConnect={onNodesConnect}
        onSelectionChange={handleSelection}
        onEdgesChange={handleSelection}
        fitView
        //@ts-ignore
        onKeyDown={handleKeyPress}
        minZoom={Number.NEGATIVE_INFINITY}
        onPaneClick={() => {
            setSelectedString("")
        }}
    >
        <Controls
            onInteractiveChange={(isInteractive) => setIsDraggable(isInteractive)}
        />
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1}/>
    </ReactFlow>
)
}
)

export default Playground