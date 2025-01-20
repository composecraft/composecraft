import useSelectionStore from "@/store/selection";
import {useComposeStore} from "@/store/compose";
import {
    Binding,
    Delay,
    HealthCheck,
    Image,
    PortMapping,
    RestartPolicyCondition,
    Service,
    TimeUnits, Volume
} from "@composecraft/docker-compose-lib";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Eraser, EthernetPort, FolderTree} from "lucide-react";
import QuickToolType from "@/components/ui/quickToolType";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Separator} from "@/components/ui/separator";
import DurationInput from "@/components/playground/editor/durationInput";
import {addExtraDots} from "@/lib/utils";

export default function ServiceEditor(){

    const {selectedId} = useSelectionStore();
    const {compose, setCompose} = useComposeStore()

    function getService():Service{
        const service = compose.services.get("id",selectedId)
        if(service){
            return service
        }
        throw Error(`${selectedId} service is not found`)
    }

    return (
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Service</p>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger className="w-full" value="general">General</TabsTrigger>
                    <TabsTrigger className="w-full" value="volume">Volumes</TabsTrigger>
                    <TabsTrigger className="w-full" value="network">Networking</TabsTrigger>
                    <TabsTrigger className="w-full" value="health">Health</TabsTrigger>
                </TabsList>
                <TabsContent className="flex flex-col gap-5 w-full" value="general">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">Name</label>
                        <Input name="name" value={getService().name}
                               onChange={(e) => {
                                   setCompose(() => getService().name = e.target.value)
                               }}
                        />
                    </div>
                    <div className="flex flex-row justify-between">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="image">Image</label>
                            <Input data-umami-event="playground-editor-input-imageName" name="image" value={getService().image?.name || ""}
                                   onChange={(e) => {
                                       setCompose(() => {
                                           const image = getService().image
                                           if (image) {
                                               image.name = e.target.value
                                           } else {
                                               getService().image = new Image({name: e.target.value})
                                           }
                                       })
                                   }}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="tag">Tag</label>
                            <Input data-umami-event="playground-editor-input-imageTag" defaultValue="latest" name="tag" value={getService().image?.tag}
                                   onChange={(e) => {
                                       setCompose(() => {
                                           const image = getService().image
                                           if (image) {
                                               image.tag = e.target.value
                                           } else {
                                               getService().image = new Image({name: "", tag: e.target.value})
                                           }
                                       })
                                   }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-row justify-between">
                            Restart
                            <QuickToolType className=""
                                           message={"Configure if and how to restart containers when they exit"}/>
                        </label>
                        {/* @ts-expect-error tkt*/}
                        <Select value={RestartPolicyCondition[getService().restart]}
                                onValueChange={(value) => {
                                    setCompose(() => {
                                        //@ts-expect-error tkt
                                        const newValue = RestartPolicyCondition[value]
                                        if (newValue) {
                                            getService().restart = newValue
                                        }
                                    })
                                }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="restart policy ..."/>
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    (Object.keys(RestartPolicyCondition) as Array<keyof typeof RestartPolicyCondition>).map((key) => (
                                        <SelectItem key={key} value={key}>
                                            {RestartPolicyCondition[key]}
                                        </SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="flex flex-row justify-between" htmlFor="command">
                            Command
                            <QuickToolType className="" message={"Override command run by the container"}/>
                        </label>
                        <Input name="command" value={getService().command?.join(" ")}
                               onChange={(e) => {
                                   setCompose(() => getService().command = e.target.value.split(" "))
                               }}
                        />
                    </div>
                    <div>
                        <label className="flex flex-row justify-between" htmlFor="entryPoint">
                            Entry point
                            <QuickToolType className="" message={"Override container's default executable"}/>
                        </label>
                        <Input name="entryPoint" value={getService().entrypoint}
                               onChange={(e) => {
                                   setCompose(() => getService().entrypoint = e.target.value)
                               }}
                        />
                    </div>
                </TabsContent>
                <TabsContent value="volume">
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-row justify-between">
                            Bindings
                            <QuickToolType className=""
                                           message={"Bindings are local folder mounted inside the container"}/>
                        </label>
                        <Button data-umami-event="playground-editor-btn-addBinding" type="button" className="flex flex-row gap-2" onClick={()=>{
                            setCompose(()=>{
                                getService().bindings.add(new Binding({
                                    source: "./",
                                    target: "/"
                                }))
                            })
                        }}>
                            <FolderTree height={20}/>
                            Add binding
                        </Button>
                        {
                            Array.from(getService().bindings).filter((binding)=>(binding.source as Volume)?.id === undefined) //get only the direct bindings
                                .map((binding)=>{
                                    return(
                                        <div className='flex flex-row gap-2 items-center'>
                                            <p className="w-20">{addExtraDots((binding.source as string),10,false)}</p>
                                                <Input value={binding.target}
                                                       onChange={(e) => setCompose(() => {
                                                           const vol = getService().bindings.get("id",binding.id)
                                                           if(vol){
                                                               vol.target = e.target.value
                                                           }
                                                       })}/>
                                            <Button type="button" className="bg-slate-200" variant="secondary"
                                                    onClick={() => setCompose(() => {
                                                        getService().bindings.delete(binding)
                                                    })}>
                                                <Eraser/>
                                            </Button>
                                        </div>
                                    )
                                })
                        }
                        <Separator className='my-3' />
                        <label className="flex flex-row justify-between">
                            Volumes
                            <QuickToolType className=""
                                           message={"Volumes are docker managed folder mounted inside the container"}/>
                        </label>
                        {
                            Array.from(getService().bindings).filter((binding) => (binding.source as Volume)?.id !== undefined) //get only the volumes bindings
                                .map((binding) => {
                                    return (
                                        <div className='flex flex-row gap-2 items-center'>
                                            <p>{addExtraDots((binding.source as Volume).name,10)}</p>
                                            <Input value={binding.target}
                                                   onChange={(e) => setCompose(() => {
                                                       const vol = getService().bindings.get("id", binding.id)
                                                       if (vol) {
                                                           vol.target = e.target.value
                                                       }
                                                   })}/>
                                            <Button type="button" className="bg-slate-200" variant="secondary"
                                                    onClick={() => setCompose(() => {
                                                        getService().bindings.delete(binding)
                                                    })}>
                                                <Eraser/>
                                            </Button>
                                        </div>
                                    )
                                })
                        }
                    </div>
                </TabsContent>
                <TabsContent value="network">
                    <div className="flex flex-col gap-2">
                        <label className="flex flex-row justify-between">
                            Ports
                            <QuickToolType className="" message={"Ports you want to expose from the container"}/>
                        </label>
                        {getService().ports?.map((port, index) => (
                            <>
                                <div className='flex flex-row gap-2 items-end'>
                                    <div className='flex flex-col w-full'>
                                        <label className="text-sm">Host</label>
                                        <Input value={port.hostPort}
                                               {...{}/*@ts-expect-error tkt*/}
                                               onChange={(e) => setCompose(() => getService().ports[index].hostPort = Number(e.target.value))}/>
                                    </div>
                                    <div className='flex flex-col w-full'>
                                        <label className="text-sm">Container</label>
                                        {/*@ts-expect-error tkt*/}
                                        <Input value={port.containerPort} onChange={(e) => setCompose(() => getService().ports[index].containerPort = Number(e.target.value))}/>
                                    </div>
                                    <Button type="button" className="bg-slate-200" variant="secondary"
                                            onClick={() => setCompose(() => {
                                                getService().ports?.splice(index, 1)
                                            })}>
                                        <Eraser/>
                                    </Button>
                                </div>
                                <Separator/>
                            </>
                        ))}
                        <Button data-umami-event="playground-editor-input-addPortExpose" type="button"
                                onClick={() => setCompose(() => {
                                    const servicePorts = getService().ports
                                    if (servicePorts) {
                                        servicePorts.push(new PortMapping({containerPort: 80, hostPort: 80}))
                                    } else {
                                        getService().ports = [
                                            new PortMapping({containerPort: 80, hostPort: 80})
                                        ]
                                    }
                                })} className="flex flex-row gap-2">
                            <EthernetPort height={20}/>Add mapping
                        </Button>
                        <Separator/>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="network_mode">Network mode</label>
                            <Input name="network_mode" value={getService().network_mode || ""}
                                   onChange={(e) => {
                                       setCompose(() => getService().network_mode = e.target.value)
                                   }}
                            />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent className="flex flex-col gap-5 w-full" value="health">
                    <div>
                        <label className="flex flex-row justify-between" htmlFor="test">
                            Test
                            <QuickToolType className=""
                                           message={"The command that will be ran to check container health"}/>
                        </label>
                        <Input name="test" value={getService().healthcheck?.test?.join(" ")}
                               onChange={(e) => {
                                   setCompose(() => {
                                       const health = getService().healthcheck
                                       if (health) {
                                           health.test = e.target.value.split(" ")
                                       } else {
                                           getService().healthcheck = new HealthCheck({
                                               test: e.target.value.split(" "),
                                               interval: new Delay(30, TimeUnits.SECONDS)
                                           })
                                       }
                                   })
                               }}
                        />
                    </div>
                    <div>
                        <label className="flex flex-row justify-between" htmlFor="retry">
                            Retry
                            <QuickToolType className=""
                                           message={"Number of retry before the container become unhealthy"}/>
                        </label>
                        <Input name="retry" placeholder="3" value={getService().healthcheck?.retries}
                               onChange={(e) => {
                                   setCompose(() => {
                                       const health = getService().healthcheck
                                       if (health) {
                                           health.retries = Number(e.target.value)
                                       } else {
                                           getService().healthcheck = new HealthCheck({
                                               test: [],
                                               interval: new Delay(30, TimeUnits.SECONDS),
                                               retries: Number(e.target.value)
                                           })
                                       }
                                   })
                               }}
                        />
                    </div>
                    <div>
                        <label className="flex flex-row justify-between">
                            Timeout
                            <QuickToolType className="" message={"Maximum time for a command before failing"}/>
                        </label>
                        <DurationInput onValueChange={(newDelay) => {
                            setCompose(() => {
                                const health = getService().healthcheck
                                if (health) {
                                    health.timeout = newDelay
                                } else {
                                    getService().healthcheck = new HealthCheck({
                                        test: [],
                                        interval: new Delay(30, TimeUnits.SECONDS),
                                        timeout: newDelay
                                    })
                                }
                            })
                        }}/>
                    </div>
                    <div>
                        <label className="flex flex-row justify-between">
                            Start period
                            <QuickToolType className="" message={"Delay before the first test"}/>
                        </label>
                        <DurationInput onValueChange={(newDelay) => {
                            setCompose(() => {
                                const health = getService().healthcheck
                                if (health) {
                                    health.start_period = newDelay
                                } else {
                                    getService().healthcheck = new HealthCheck({
                                        test: [],
                                        interval: new Delay(30, TimeUnits.SECONDS),
                                        start_period: newDelay
                                    })
                                }
                            })
                        }}/>
                    </div>
                    <div>
                        <label className="flex flex-row justify-between">
                            Start interval
                            <QuickToolType className="" message={"Time between retries during startup"}/>
                        </label>
                        <DurationInput onValueChange={(newDelay) => {
                            setCompose(() => {
                                const health = getService().healthcheck
                                if (health) {
                                    health.start_interval = newDelay
                                } else {
                                    getService().healthcheck = new HealthCheck({
                                        test: [],
                                        interval: new Delay(30, TimeUnits.SECONDS),
                                        start_interval: newDelay
                                    })
                                }
                            })
                        }}/>
                    </div>
                </TabsContent>
            </Tabs>
        </form>
    )

}