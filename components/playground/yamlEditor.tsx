import {Editor} from "@monaco-editor/react";
import {useComposeStore} from "@/store/compose";
import {Translator} from "@composecraft/docker-compose-lib";
import YAML from 'yaml'

export default function YamlEditor(){

    const {compose} = useComposeStore()

    function getComposeValue():string{
        let result = ""
        const translator = new Translator(compose)
        result = YAML.stringify(translator.toDict())
        return result
    }

    return(
            <Editor
                width="w-full"
                height="60vh"
                defaultLanguage="yaml"
                defaultValue={getComposeValue()}
            />
    )
}