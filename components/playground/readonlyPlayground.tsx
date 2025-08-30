"use client"

import {Compose, Translator, Volume} from "@composecraft/docker-compose-lib";
import {NodeData} from "@/components/playground/playground";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import ServiceNode from "@/components/playground/node/serviceNode";
import NetworkNode from "@/components/playground/node/networkNode";
import VolumeNode from "@/components/playground/node/volumeNode";
import BindingNode from "@/components/playground/node/bindingNode";
import EnvNode from "@/components/playground/node/envNode";
import {Background, BackgroundVariant, Edge, Node, ReactFlow, XYPosition} from "@xyflow/react";
import {dependencyEdgeStyle, envEdgeStyle, networkEdgeStyle, volumeEdgeStyle} from "@/components/playground/node/utils";
import '@xyflow/react/dist/style.css'
import {composeMetadata, recreatePositionMap, reHydrateComposeIds} from "@/lib/metadata";
import CustomBackground from "@/components/playground/customBackground";

interface options {
    compose : Compose
    positionMap: composeMetadata
}

export default function ReadOnlyPlayGround(opt:options){

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [compose,setCompose] = useState(new Compose())
    const [positionMap, setPositionMap] = useState<Map<string,NodeData>>(new Map())

    useEffect(() => {
        if(opt.compose){
            const c = Translator.fromDict(opt.compose)
            setCompose(c)
            if(opt.positionMap){
                reHydrateComposeIds(c,opt.positionMap)
                setPositionMap(recreatePositionMap(opt.positionMap.positionMap))
            }
        }
    }, [opt]);

    useEffect(() => {
        compose.services.forEach((service) => {
            if (!positionMap.has(service.id)) {
                positionMap.set(service.id,
                    {
                        position: {x: 0, y: 0},
                    })
            }
        })
    }, [compose,positionMap]);

    const nodeTypes = useMemo(() => (
        {
            service: ServiceNode,
            network: NetworkNode,
            volume: VolumeNode,
            binding: BindingNode,
            env: EnvNode
        }
    ), [])

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
    }, [positionMap]);

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
        [updatePosition]
    )

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

    return(
        <ReactFlow
            nodes={composeToNodes(compose)}
            edges={composeToEdge(compose)}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChanges}
            fitView={true}
            panOnDrag={false}
            maxZoom={1}
            minZoom={Number.NEGATIVE_INFINITY}
        >
            <CustomBackground id="2" gap={500} offset={50}/>
            <Background id="1" variant={"dots" as BackgroundVariant} gap={12} size={1}/>
        </ReactFlow>
    )

}