import useSelectionStore from "@/store/selection";
import {ReactElement} from "react";
import ServiceEditor from "@/components/playground/editor/serviceEditor";
import NetowrkEditor from "@/components/playground/editor/networkEditor";
import BindingEditor from "@/components/playground/editor/bindingEditor";
import VolumeEditor from "@/components/playground/editor/volumeEditor";
import EnvEditor from "@/components/playground/editor/envEditor";
import ComposeSettingEditor from "@/components/playground/editor/composeSettingEditor";


export default function EditMenu():ReactElement{
    const {selectedId} = useSelectionStore();

    switch (selectedId.substring(0,3)){
        case "ser":
            return <ServiceEditor />
        case "net":
            return <NetowrkEditor />
        case "bin":
            return <BindingEditor />
        case "vol":
            return <VolumeEditor />
        case "env":
            return <EnvEditor />
        default:
            return (
                <ComposeSettingEditor />
            )
    }
}