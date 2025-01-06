import useSelectionStore from "@/store/selection";
import {useComposeStore} from "@/store/compose";
import {Volume} from "@composecraft/docker-compose-lib";
import {Input} from "@/components/ui/input";

export default function VolumeEditor(){

    const {selectedId} = useSelectionStore();
    const {compose, setCompose} = useComposeStore();

    function getVolume():Volume|undefined{
        return compose.volumes.get("id",selectedId)
    }

    return(
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Volume</p>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="target">Name</label>
                    <Input name="target" value={getVolume()?.name}
                           onChange={(e) => {
                               setCompose(() => {
                                   const vol = getVolume()
                                   if(vol){
                                       vol.name = e.target.value
                                   }
                               })
                           }}
                    />
                </div>
            </div>
        </form>
    )
}