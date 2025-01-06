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
import {dependencyEdgeStyle, envEdgeStyle, networkEdgeStyle, volumeEdgeStyle} from "@/components/playground/node/utils";
import ELK from 'elkjs/lib/elk.bundled.js';

import '@xyflow/react/dist/style.css'
import useSelectionStore from "@/store/selection";
import VolumeNode from "@/components/playground/node/volumeNode";
import BindingNode from "@/components/playground/node/bindingNode";
import EnvNode from "@/components/playground/node/envNode";
import usePositionMap from "@/store/metadataMap";

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

    const updatePosition = (key: string, newPosition: XYPosition) => {
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
    };

    useEffect(() => {
        compose.services.forEach((service) => {
            if (!positionMap.has(service.id)) {
                positionMap.set(service.id,
                    {
                        position: {x: 0, y: 0},
                    })
            }
        })
    }, [compose]);

    const nodeTypes = useMemo(() => (
        {
            service: ServiceNode,
            network: NetworkNode,
            volume: VolumeNode,
            binding: BindingNode,
            env: EnvNode
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
        changes.forEach((change) => {
            if (change?.type === "position") {
                if (change?.position?.x && change?.position?.y) {
                    //console.log(change.position)
                    updatePosition(change.id, change.position)
                }
            }
        })
    },
    [positionMap]
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
            switch (select.substring(0, 3)) {
                case "edg":
                    setCompose((compose) => {
                        switch (select.substring(4, 4 + 3)) {
                            case "ser":
                                const target = compose.services.get("id", select.substring(44))
                                const source = compose.services.get("id", select.substring(4, 44))
                                if (source && target) {
                                    target.depends_on.delete(source)
                                }
                                break
                            case "net":
                                const ser = compose.services.get("id", select.substring(44))
                                const net = compose.networks.get("id", select.substring(4, 44))
                                if (ser && net) {
                                    ser.networks.delete(net)
                                }
                                break
                            case "env":
                                const env_ser = compose.services.get("id", select.substring(44))
                                const env = compose.envs.get("id", select.substring(4, 44))
                                if (env_ser && env) {
                                    env_ser.environment?.delete(env)
                                }
                                break
                            case "vol":
                                const vol_ser = compose.services.get("id", select.substring(44))
                                if (vol_ser) {
                                    vol_ser.bindings.forEach((bin) => {
                                        if ((bin.source as Volume)?.id === select.substring(4, 44)) {
                                            vol_ser.bindings.delete(bin)
                                        }
                                    })
                                }
                                break
                            case "bin":
                                const bin_ser = compose.services.get("id", select.substring(44))
                                if (bin_ser) {
                                    bin_ser.bindings.forEach((bin) => {
                                        if ((bin.id as string) === select.substring(4, 44)) {
                                            bin_ser.bindings.delete(bin)
                                        }
                                    })
                                }
                                break
                            default:
                                //console.log(select.substring(4,4+3))
                                break
                        }
                    })
                    break;
                case "ser" :
                    setCompose((compose) => {
                        const ser = compose.services.get("id", select)
                        if (ser) {
                            setSelectedString("")
                            compose.services.delete(ser)
                        }
                    })
                    break
                case "net":
                    setCompose((compose) => {
                        const net = compose.networks.get("id", select)
                        if (net) {
                            setSelectedString("")
                            compose.networks.delete(net)
                        }
                    })
                    break
                case "env":
                    setCompose((compose) => {
                        const env = compose.envs.get("id", select)
                        if (env) {
                            setSelectedString("")
                            compose.removeEnv(env)
                        }
                    })
                    break
                case "bin":
                    setCompose((compose) => {
                        compose.services.forEach((ser) => {
                            ser.bindings.forEach((bin) => {
                                if (bin.id === select) {
                                    ser.bindings.delete(bin)
                                }
                            })
                        })
                    })
                    break
                case "vol":
                    setCompose((compose) => {
                        compose.services.forEach((ser) => {
                            ser.bindings.forEach((bin) => {
                                const src = bin.source as Volume
                                if (src?.id === select) {
                                    ser.bindings.delete(bin)
                                }
                            })
                        })
                        const volume = compose.volumes.get('id', select)
                        if (volume) {
                            compose.volumes.delete(volume)
                        }
                    })
                    break
                default:
                    break
            }
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
        //@ts-ignore
        onKeyDown={handleKeyPress}
        onPaneClick={() => {
            setSelectedString("")
        }}
    >
        <Controls/>
        <Background variant={"dots" as BackgroundVariant} gap={12} size={1}/>
    </ReactFlow>
)
}
)

export default Playground