import useSelectionStore from "@/store/selection";
import {useComposeStore} from "@/store/compose";
import {Env} from "@composecraft/docker-compose-lib";
import {Input} from "@/components/ui/input";

export default function EnvEditor(){

    const {selectedId} = useSelectionStore();
    const {compose, setCompose} = useComposeStore();

    function getEnv():Env|undefined{
        return compose.envs.get("id",selectedId)
    }

    return(
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Environment</p>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="target">key</label>
                    <Input name="target" value={getEnv()?.key}
                           onChange={(e) => {
                               setCompose(() => {
                                   const env = getEnv()
                                   if (env) {
                                       env.key = e.target.value
                                   }
                               })
                           }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="target">Value</label>
                    <Input name="target" value={getEnv()?.value}
                           onChange={(e) => {
                               setCompose(() => {
                                   const env = getEnv()
                                   if (env) {
                                       env.value = e.target.value
                                   }
                               })
                           }}
                    />
                </div>
            </div>
        </form>
    )
}