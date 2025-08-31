import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Copy, ExternalLink} from "lucide-react";
import toast from "react-hot-toast";
import useComposeIdStore from "@/store/composeId";
import {useState} from "react";
import {shareCompose} from "@/actions/composeActions";
import {useComposeStore} from "@/store/compose";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import EmbedSignin from "@/components/display/embedSignin";

export default function ShareButton({inviteMode = false}: { inviteMode?: boolean }) {

    const {compose} = useComposeStore();
    const {id} = useComposeIdStore()
    const [link, setLink] = useState("")

    async function handleShare(composeId: string) {
        if(inviteMode){
            return
        }
        try {
            const res = await shareCompose(composeId)
            setLink(`${res}&name=${compose?.name}`)
        } catch (e) {
            console.error(e)
            toast.error("error")
        }
    }

    return inviteMode ?
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={inviteMode ? false: !id}
                        variant="secondary" className="bg-slate-200 flex gap-2">
                    <ExternalLink height={20}/>
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent>
                <div>
                    <EmbedSignin redirectToPlayGround={true} />
                </div>
            </DialogContent>
        </Dialog> :
        <Popover>
            <PopoverTrigger asChild>
                <Button disabled={inviteMode ? false: !id}
                        onClick={() => handleShare(id || "")} variant="secondary" className="bg-slate-200 flex gap-2">
                    <ExternalLink height={20}/>
                    Share
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                {
                    inviteMode ? <div>mode invité</div>
                        :
                        <>
                                <span className="flex flex col justify-between rounded border-2 p-1">
                                    <input className="outline-0" value={link}/>
                                    <button onClick={() => {
                                        navigator.clipboard.writeText(link);
                                        toast("link copied")
                                    }} type="button"
                                            className='rounded bg-black text-white text-xs flex flex-row justify-center items-center gap-2 py-1 px-2 active:bg-slate-500 transition-all'>
                                        <Copy height={20} className='stroke-white'/>
                                        <p>Copy</p>
                                    </button>
                                </span>
                            <p className="text-sm text-slate-600">You can share this link to anyone, they won't
                                require any account to view this compose</p>
                        </>
                }
            </PopoverContent>
        </Popover>
}