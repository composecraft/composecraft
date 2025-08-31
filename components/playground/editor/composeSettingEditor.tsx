"use client"

import {save, useComposeStore} from "@/store/compose";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger} from "@/components/ui/select";
import {ComposeVersion, Env, Network, Service, Volume} from "@composecraft/docker-compose-lib";
import {Button} from "@/components/ui/button";
import {Container, Folder, Key, NetworkIcon, Save} from "lucide-react";
import {generateRandomName} from "@/lib/utils";
import QuickToolType from "@/components/ui/quickToolType";
import toast from "react-hot-toast";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import EmbedSignin from "@/components/display/embedSignin";
import useDisableStateStore from "@/store/disabled";
export default function ComposeSettingEditor() {

    const {compose, setCompose} = useComposeStore();
    const {state:disabled} = useDisableStateStore()

    function ser(){
        setCompose((current)=>{
            current.addService(new Service({
                name: generateRandomName()
            }))
        })
    }

    function net(){
        setCompose((current)=>{
            current.addNetwork(new Network({name: generateRandomName()}))
        })
    }

    function vol(){
        setCompose((current)=>{
            current.volumes.add(new Volume({name:generateRandomName()}))
        })
    }

    function env(){
        setCompose((current)=>{
            current.envs.add(new Env(generateRandomName().toUpperCase(),""))
        })
    }

    async function handleSave(){
        try {
            await save(compose)
            toast.success("saved")
        }catch (e){
            toast.error('error')
            console.error(e)
        }
    }

    return (
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Compose</p>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label className='flex flex-row justify-between items-end' htmlFor="target">Name <QuickToolType
                        className="" message={"Docker compose global name"}/></label>
                    <Input name="target" value={compose.name}
                           onChange={(e) => {
                               setCompose((currentCompose) => {
                                   currentCompose.name = e.target.value
                               })
                           }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className='flex flex-row justify-between items-end' htmlFor="target">Version <QuickToolType
                        className="" message={"Docker compose version as been deprecated"}/></label>
                    <Select value={compose.version?.toString() || " "} onValueChange={(value)=>{setCompose((c)=>{
                        if(value === " "){
                            c.version = undefined
                        }else{
                            c.version = Number(value) as ComposeVersion
                        }
                    })}}>
                        <SelectTrigger>
                            {compose.version || "Unspecified"}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={"3.8"}>3.8</SelectItem>
                            <SelectItem value={"3.7"}>3.7</SelectItem>
                            <SelectItem value={"3.5"}>3.5</SelectItem>
                            <SelectItem value={"3.3"}>3.3</SelectItem>
                            <SelectItem value={"3.2"}>3.2</SelectItem>
                            <SelectItem value={"3.1"}>3.1</SelectItem>
                            <SelectItem value={"3.0"}>3.0</SelectItem>
                            <SelectItem value={" "}>Unspecified</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-1 grid-cols-2">
                    <Button type='button' className="flex flex-row gap-2" onClick={ser}>
                        <Container width={20}/> Add service
                    </Button>
                    <Button type='button' className="flex flex-row gap-2" onClick={net}>
                        <NetworkIcon width={20}/>Add network
                    </Button>
                    <Button type='button' className="flex flex-row gap-2" onClick={vol}>
                        <Folder width={20}/> Add volume
                    </Button>
                    <Button type='button' className="flex flex-row gap-2" onClick={env}>
                        <Key width={20}/> Add Environment
                    </Button>
                </div>
                {disabled ?
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button type="button" className="col-span-2">
                                <Save width={20} /> Save
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <div>
                                <EmbedSignin redirectToPlayGround={true} />
                            </div>
                        </DialogContent>
                    </Dialog>
                    :
                    <Button type="button" onClick={()=>{handleSave()}} className="col-span-2">
                        <Save width={20} /> Save
                    </Button>
                }
            </div>
        </form>
    )
}