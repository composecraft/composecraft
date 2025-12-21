import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {Copy, Github} from "lucide-react";
import toast from "react-hot-toast";
import useComposeIdStore from "@/store/composeId";
import {useState} from "react";
import {generateGitHubMarkdown} from "@/actions/githubIntegration";
import {useComposeStore} from "@/store/compose";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";
import EmbedSignin from "@/components/display/embedSignin";

export default function IntegrateGitHubButton({inviteMode = false}: { inviteMode?: boolean }) {

    const {compose} = useComposeStore();
    const {id} = useComposeIdStore()
    const [markdown, setMarkdown] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    async function handleIntegrateGitHub(composeId: string) {
        if(inviteMode){
            return
        }
        try {
            setIsLoading(true)
            const result = await generateGitHubMarkdown(composeId, compose?.name || "Docker Compose")
            setMarkdown(result.markdown)
        } catch (e) {
            console.error(e)
            toast.error("Failed to generate GitHub markdown")
        } finally {
            setIsLoading(false)
        }
    }

    return inviteMode ?
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={inviteMode ? false: !id}
                        variant="secondary" className="bg-slate-200 flex gap-2">
                    <Github height={20}/>
                    Integrate GitHub
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
                        onClick={() => handleIntegrateGitHub(id || "")} 
                        variant="secondary" 
                        className="bg-slate-200 flex gap-2">
                    <Github height={20}/>
                    Integrate GitHub
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                {
                    inviteMode ? <div>mode invité</div>
                        :
                        <>
                            {!markdown ? (
                                <div className="flex flex-col gap-2">
                                    <p className="text-sm text-slate-600">Click the button to generate GitHub markdown</p>
                                    <Button 
                                        onClick={() => handleIntegrateGitHub(id || "")}
                                        disabled={isLoading}
                                        className="w-full"
                                    >
                                        {isLoading ? 'Generating...' : 'Generate Markdown'}
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <span className="flex flex col justify-between rounded border-2 p-1">
                                        <input className="outline-0 text-xs" value={markdown} readOnly/>
                                        <button onClick={() => {
                                            navigator.clipboard.writeText(markdown);
                                            toast("Markdown copied to clipboard!")
                                        }} type="button"
                                                className='rounded bg-black text-white text-xs flex flex-row justify-center items-center gap-2 py-1 px-2 active:bg-slate-500 transition-all'>
                                            <Copy height={20} className='stroke-white'/>
                                            <p>Copy</p>
                                        </button>
                                    </span>
                                    <p className="text-sm text-slate-600">Paste this markdown into your GitHub README.md to display your compose architecture diagram</p>
                                </>
                            )}
                        </>
                }
            </PopoverContent>
        </Popover>
}
