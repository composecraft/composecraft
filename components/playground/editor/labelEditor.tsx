import {Editor} from "@monaco-editor/react";

export default function LabelEditor({value,setValue}:{value:string,setValue:(arg0: string)=>void }){
    return(
        <Editor
            width="w-full"
            height="40vh"
            defaultLanguage="yaml"
            value={value}
            onChange={(content)=>{setValue(content||"")}}
        />
    )
}