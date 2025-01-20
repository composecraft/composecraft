import {Compose, Volume} from "@composecraft/docker-compose-lib";

export function handleBackspacePress(select: string, setCompose: (updater: (currentCompose: Compose) => void) => void, setSelectedString: (value: string) => void) {
    switch (select.substring(0, 3)) {
        case "edg":
            setCompose((compose: any) => {
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
                            vol_ser.bindings.forEach((bin: any) => {
                                if ((bin.source as Volume)?.id === select.substring(4, 44)) {
                                    vol_ser.bindings.delete(bin)
                                }
                            })
                        }
                        break
                    case "bin":
                        const bin_ser = compose.services.get("id", select.substring(44))
                        if (bin_ser) {
                            bin_ser.bindings.forEach((bin: any) => {
                                if ((bin.id as string) === select.substring(4, 44)) {
                                    bin_ser.bindings.delete(bin)
                                }
                            })
                        }
                        break
                    default:
                        break
                }
            })
            break;
        case "ser" :
            setCompose((compose: any) => {
                const ser = compose.services.get("id", select)
                if (ser) {
                    setSelectedString("")
                    compose.services.delete(ser)
                }
            })
            break
        case "net":
            setCompose((compose: any) => {
                const net = compose.networks.get("id", select)
                if (net) {
                    setSelectedString("")
                    compose.networks.delete(net)
                }
            })
            break
        case "env":
            setCompose((compose: any) => {
                const env = compose.envs.get("id", select)
                if (env) {
                    setSelectedString("")
                    compose.removeEnv(env)
                }
            })
            break
        case "bin":
            setCompose((compose: any) => {
                compose.services.forEach((ser: any) => {
                    ser.bindings.forEach((bin: any) => {
                        if (bin.id === select) {
                            ser.bindings.delete(bin)
                        }
                    })
                })
            })
            break
        case "vol":
            setCompose((compose: any) => {
                compose.services.forEach((ser: any) => {
                    ser.bindings.forEach((bin: any) => {
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
}