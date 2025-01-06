"use client"

import {Background, BackgroundVariant, ReactFlow, ReactFlowProvider, useEdgesState, useNodesState} from "@xyflow/react";
import React, {ReactElement, useMemo} from "react";
import ServiceNode from "@/components/playground/node/serviceNode";
import NetworkNode from "@/components/playground/node/networkNode";
import VolumeNode from "@/components/playground/node/volumeNode";
import BindingNode from "@/components/playground/node/bindingNode";
import EnvNode from "@/components/playground/node/envNode";
import {Service, Image, Network, Volume} from "@composecraft/docker-compose-lib";

import '@xyflow/react/dist/style.css'
import {networkEdgeStyle, volumeEdgeStyle} from "@/components/playground/node/utils";

export default function Demo():ReactElement{

    const webserver = new Service({name: "webserver",image: new Image({name:"flask"})})
    webserver.id = "webserver"
    const database = new Service({name: "database",image: new Image({name:"postgres",tag:"15"})})
    webserver.id = "database"
    const net = new Network({name: "secure_net"})
    net.id= "net"
    const vol = new Volume({name: "pg_data"})
    vol.id = "vol"

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [nodes, setNodes, onNodesChange] = useNodesState([
        {
            id: webserver.id,
            position: {
                x: 225,
                y: 0
            },
            type: "service",
            draggable: true,
            data: {service : webserver}
        },
        {
            id: database.id,
            position: {
                x: 225,
                y: 200
            },
            type: "service",
            draggable: true,
            data: {service : database}
        },
        {
            id: net.id,
            position: {
                x: 0,
                y: 150
            },
            type: "network",
            draggable: true,
            data: {network : net}
        },
        {
            id: vol.id,
            position: {
                x: 450,
                y: 250
            },
            type: "volume",
            draggable: true,
            data: {volume : vol}
        }
    ]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [edges, setEdges, onEdgesChange] = useEdgesState([
        {
            id: "e1",
            source: webserver.id,
            target: net.id,
            sourceHandle: 'network',
            targetHandle: 'network',
            ...networkEdgeStyle
        },
        {
            id: "e2",
            source: database.id,
            target: net.id,
            sourceHandle: 'network',
            targetHandle: 'network',
            ...networkEdgeStyle
        },
        {
            id: "e3",
            source: database.id,
            target: vol.id,
            sourceHandle: 'volume',
            targetHandle: 'volume',
            ...volumeEdgeStyle
        }
    ]);

    const nodeTypes = useMemo(() => (
        {
            service: ServiceNode,
            network: NetworkNode,
            volume: VolumeNode,
            binding: BindingNode,
            env: EnvNode
        }
    ), [])

    const proOptions = { hideAttribution: true };
    return(
        <ReactFlowProvider>
            <ReactFlow
                data-umami-event="demo-interact"
                nodeTypes={nodeTypes}
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                onEdgesChange={onEdgesChange}
                proOptions={proOptions}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={false}
                viewport={
                   {
                       x: typeof window !== "undefined" ? window?.document?.body?.offsetWidth - 600 : 800,
                       y: 70,
                       zoom: 1
                   }
                }
            >
                <Background variant={"dots" as BackgroundVariant} gap={12} size={1}/>
            </ReactFlow>
        </ReactFlowProvider>
    )
}