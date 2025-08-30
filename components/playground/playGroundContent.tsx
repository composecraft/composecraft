import {useSearchParams} from "next/navigation";
import useComposeIdStore from "@/store/composeId";
import {useComposeStore} from "@/store/compose";
import usePositionMap from "@/store/metadataMap";
import {useEffect, useMemo, useRef, useState} from "react";
import Playground, {PlaygroundHandle} from "@/components/playground/playground";
import toast from "react-hot-toast";
import {getComposeById} from "@/actions/userActions";
import {composeMetadata, recreatePositionMap, reHydrateComposeIds} from "@/lib/metadata";
import {Compose, Translator} from "@composecraft/docker-compose-lib";
import {generateRandomName} from "@/lib/utils";
import {default as NextImage} from "next/image";
import logo from "@/assets/logo.png";
import {Button} from "@/components/ui/button";
import YAML from "yaml";
import {Code, FileDown, FileUp, FlaskRound, Library, Sparkles} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import YamlEditor from "@/components/playground/yamlEditor";
import EditMenu from "@/components/playground/editMenu";
import ShareButton from "@/components/playground/shareButton";
import useDisableStateStore from "@/store/disabled";
// @ts-ignore
import { Base64UrlEncoder } from "next-base64-encoder";
import EmbedSignin from "@/components/display/embedSignin";
import CreateIssueModal from "@/components/playground/createIssueModal";

interface PlayGroundContentOptions {
    inviteMode?: boolean
}


export default function PlaygroundContent(opts:PlayGroundContentOptions) {
    const { inviteMode = false } = opts;
    const { setState } = useDisableStateStore.getState();

    useEffect(() => {
        setState(inviteMode);
    }, [setState, inviteMode]);

    const replaceComposeOptions = useMemo(() => ({
        disableSave: inviteMode
    }), [inviteMode]);
    const searchParams = useSearchParams()
    const {setId} = useComposeIdStore()
    const {compose,replaceCompose} = useComposeStore();
    const {setPositionMap} = usePositionMap()
    const playgroundRef = useRef<PlaygroundHandle>(null);

    const [errorDialog,setErroDialog] = useState(false)
    const [rawImportedFile, setRawImportedFile] = useState("")

    useEffect( () => {
        if(inviteMode){
            return //prevent any save mechanism
        }
        const id = searchParams.get('id')
        const data = searchParams.get('data')
        if(id){
            getComposeById(id).then((r)=>{
                const metadta: composeMetadata = r?.metadata
                const data = r?.data
                const id = r?.id
                if(id){
                    setId(id)
                }
                if(data){
                    const savedCompose = Translator.fromDict(data)
                    if(metadta){
                        reHydrateComposeIds(savedCompose,metadta)
                        setPositionMap(recreatePositionMap(metadta.positionMap))
                    }
                    replaceCompose(savedCompose,replaceComposeOptions)
                    if(!metadta){
                        setTimeout(()=>playgroundRef.current?.onLayout("TB"),500)
                    }
                    console.debug("reloaded a previous docker compose")
                }
            })
        }else{
            setId(undefined)
            replaceCompose(new Compose({ name: generateRandomName() }),replaceComposeOptions)
        }
        if(data){
            const base64UrlEncoder = new Base64UrlEncoder();
            const byteArrayPhrase = base64UrlEncoder.encode(data);
            const decodedPhrase = new TextDecoder().decode(byteArrayPhrase)
            const parsedObj = JSON.parse(decodedPhrase)
            const savedCompose = Translator.fromDict(parsedObj?.compose)
            reHydrateComposeIds(savedCompose,parsedObj.metadata)
            setPositionMap(recreatePositionMap(parsedObj.metadata.positionMap))
            replaceCompose(savedCompose,replaceComposeOptions)
        }
    }, [inviteMode, replaceCompose, replaceComposeOptions, searchParams, setId, setPositionMap]);

    return (
        <section className="w-full flex flex-col h-full max-h-full">
            <CreateIssueModal open={errorDialog} close={()=>{setErroDialog(false)}} content={rawImportedFile} />
            <div className="items-center border-b-2 border-slate-300 flex flex-row py-4 px-10">
                <button className='' onClick={() => {
                    window.location.href = inviteMode ? "/" : "/dashboard"
                }}>
                    <NextImage src={logo} className="h-14 object-contain w-fit" alt="logo"/>
                </button>
                {inviteMode &&
                    <div className="ml-10 flex flex-row gap-10 justify-center items-center">
                        <div className="flex flex-row gap-2 font-medium">
                            <FlaskRound className="stroke-[#1A96F8]"/>
                            Try mode
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <button
                                    data-umami-event="playground-tryIt-createAccount"
                                    className="relative inline-flex items-center justify-center gap-2 px-8 py-2 font-medium transition-all duration-200 ease-in-out rounded-lg bg-gradient-to-r from-[#1A96F8] via-[#3AA8FF] to-[#62BEFF] text-white hover:opacity-90 hover:px-10 focus:outline-none focus:ring-2 focus:ring-[#1A96F8]/50 focus:ring-offset-2 shadow-lg"
                                >
                                    <Sparkles className="w-5 h-5"/>
                                    <span className="relative">Create an account</span>
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <div>
                                    <EmbedSignin redirectToPlayGround={true}/>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                }
                <div className="flex max-h-full flex-row gap-3 ml-auto">
                    <Button data-umami-event="playground-editor-btn-importFile" onClick={async () => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.yaml,.yml';

                        input.onchange = async (event) => {
                            const target = event.target as HTMLInputElement;
                            const file = target.files?.[0];
                            if (file) {
                                const content = await file.text();
                                try {
                                    setRawImportedFile(content)
                                    const parsedYaml = YAML.parse(content); // First parse the YAML content
                                    replaceCompose(Translator.fromDict(parsedYaml), replaceComposeOptions)
                                    setTimeout(() => {
                                        playgroundRef.current?.onLayout("TB")
                                    }, 1000)
                                } catch (error) {
                                    console.error('Error reading file:', error);
                                    setErroDialog(true)
                                }
                            }
                            // Clean up
                            input.remove();
                        };
                        input.click();
                    }} variant="secondary" className="bg-slate-200 flex gap-2">
                        <FileUp height={20}/>
                        Import file
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button data-umami-event="playground-editor-btn-viewCode" variant="secondary"
                                    className="bg-slate-200 flex gap-2">
                                <Code height={20}/>
                                View Code
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="min-w-[70vw]">
                            <DialogTitle>
                                docker-compose.yaml
                            </DialogTitle>
                            <div>
                                <YamlEditor/>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button data-umami-event="playground-editor-btn-autoLayout" className="bg-slate-200 flex gap-2"
                            variant="secondary" onClick={() => playgroundRef.current?.onLayout("TB")}>
                        Auto layout
                    </Button>
                    <ShareButton inviteMode={inviteMode}/>
                    <Button data-umami-event="playground-editor-btn-..." variant="secondary" className="bg-slate-200">
                        ...
                    </Button>
                </div>
            </div>
            <div className="w-full flex-grow flex flex-row pb-5">
                <span className="w-3/4 m-5 mb-0 rounded-xl border-2 ">
                    <Playground ref={playgroundRef}/>
                </span>
                <div className="w-1/4 flex flex-col mr-5 h-full justify-between">
                    <div className="pt-5">
                        <EditMenu/>
                    </div>
                    <div className="flex-col flex gap-2">
                    <Button data-umami-event="playground-editor-btn-downloadCompose" type="button" onClick={() => {
                            const translator = new Translator(compose)
                            const result = YAML.stringify(translator.toDict())
                            const blob = new Blob([result], { type: 'text/yaml' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'docker-compose.yaml';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }} className="w-full flex gap-2">
                            <FileDown height={20} />
                            Download compose
                        </Button>
                        <Button data-umami-event="playground-editor-btn-library" onClick={()=>toast(
                            "This feature is not already released",{
                                icon: "⚠️"
                            }
                        )} variant="secondary" className="w-full flex gap-2 bg-slate-200">
                            <Library />
                            Library
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}