import {Compose} from "@composecraft/docker-compose-lib";
import {NodeData} from "@/components/playground/playground";

export type nameId = {
    id: string;
    name: string;
}
type PositionMap = {
    id: string,
    position : {
        x: number,
        y: number
    }
}

export type composeMetadata = {
    Ids: {
        servicesIds: nameId[];
        networksIds: nameId[];
        volumesIds: nameId[];
        bindingsIds: nameId[];
        envsIds: nameId[];
        labelsIds: nameId[];
    }
    positionMap: PositionMap[]
}

export function extractMetadata(compose:Compose,positionMap:Map<string,NodeData>):composeMetadata{
    const result: composeMetadata = {
        Ids : {
            servicesIds: [],
            networksIds: [],
            volumesIds: [],
            bindingsIds: [],
            envsIds: [],
            labelsIds: []
        },
        positionMap: []
    }
    compose.services.forEach(service=>{
        result.Ids.servicesIds.push({name: service?.name, id: service.id})
        service.bindings.forEach(bin=>{
            if(typeof bin.source === "string"){
                result.Ids.bindingsIds.push({name: bin.source, id: bin.id})
            }
        })
        service.labels?.forEach(label => {
            result.Ids.labelsIds.push({name: `${service.id}___${label.key}`, id: label.id})
        })
    })
    compose.networks.forEach(network=>result.Ids.networksIds.push({name: network.name, id: network.id}))
    compose.volumes.forEach(volume=>result.Ids.volumesIds.push({name: volume.name, id: volume.id}))
    compose.envs.forEach(env=>result.Ids.envsIds.push({name:env.key, id: env.id}))
    positionMap.forEach((key,value)=>result.positionMap.push({
        id: value,
        position: {
            x: key.position.x,
            y: key.position.y
        }
    }))
    console.log(result)
    return result
}

export function reHydrateComposeIds(compose:Compose,metadata:composeMetadata){
    console.log(metadata)
    metadata.Ids.servicesIds.forEach(({name,id})=>{
        const service = Array.from(compose.services).find(s=>s.name === name)
        if(service){
            service.id = id
        }
        service?.bindings.forEach((bin)=>{
            const found = metadata.Ids.bindingsIds.find(b=>b.name === bin.source)
            if(found){
                bin.id= found.id
            }
        })
    })
    metadata.Ids.networksIds.forEach(({name,id})=>{
        const network = Array.from(compose.networks).find(n=>n.name === name)
        if(network){
            network.id = id
        }
    })
    metadata.Ids.envsIds.forEach(({name,id})=>{
        const env = Array.from(compose.envs).find(n=>n.key === name)
        if(env){
            env.id = id
        }
    })
    metadata.Ids.volumesIds.forEach(({name,id})=>{
        const vol = Array.from(compose.volumes).find(n=>n.name === name)
        if(vol){
            vol.id = id
        }
    })
    metadata.Ids.labelsIds.forEach(({name, id}) => {
        const [serviceId, labelKey] = name.split('___');
        if (serviceId && labelKey) {
            const service = Array.from(compose.services).find(s => s.id === serviceId);
            if (service) {
                const label = service.labels?.find(l => l.key === labelKey);
                if (label) {
                    label.id = id;
                }
            }
        }
    })
}

export function recreatePositionMap(input:PositionMap[]):Map<string,NodeData>{
    const result = new Map()
    input.forEach((v)=>{
        result.set(v.id,{
            position : v.position
        })
    })
    return result
}
