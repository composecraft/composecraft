"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";

export default function CreateIssueModal({content,open,close}:{content:string,open:boolean,close:()=>void}){

    function createGithubIssue(content:string){
        const encodedContent = encodeURIComponent(`
\`\`\`yaml
${content}
\`\`\`
`);
        window.location.href = `https://github.com/composecraft/docker-compose-lib/issues/new?assignees=&title=Error%20Reading%20file&labels=bug&projects=&template=FILE_READING.yml&file=${encodedContent}`
    }

    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        It seem an error happened, would you like to submit this as an issue on the github ?
                    </DialogTitle>
                    <DialogDescription>
                        If you click on "submit issue" the docker-compose.yaml file you tried to import will be publicly visible on the composecraft github (but you won't be directly linked to the issue if nothing identify you in the file content). <br/><br/>
                        <strong className="text-red-400">
                            DO NOT SUBMIT ISSUE IF YOU HAVE ANY CONFIDENTIAL CONTENT IN THE FILE.
                        </strong>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={()=>{close()}} variant={"destructive"}>
                        Cancel
                    </Button>
                    <Button onClick={async ()=>{createGithubIssue(content);close()}}>
                        Submit issue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}