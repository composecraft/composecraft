import useSelectionStore from "@/store/selection";
import {useComposeStore} from "@/store/compose";
import {KeyValue} from "@composecraft/docker-compose-lib";
import {Input} from "@/components/ui/input";

export default function LabelEditor() {
    const {selectedId} = useSelectionStore();
    const {compose, setCompose} = useComposeStore();

    function getLabel(): KeyValue | undefined {
        // Search through all services to find the label with matching ID
        for (const service of compose.services) {
            if (service.labels) {
                const foundLabel = service.labels.find(label => label.id === selectedId);
                if (foundLabel) {
                    return foundLabel;
                }
            }
        }
        return undefined;
    }

    return (
        <form className="flex flex-col gap-5">
            <p className="text-2xl font-semibold">Label</p>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="key">Key</label>
                    <Input
                        id="key"
                        value={getLabel()?.key || ""}
                        onChange={(e) => {
                            setCompose(() => {
                                const label = getLabel();
                                if (label) {
                                    label.key = e.target.value;
                                }
                            });
                        }}
                    />
                </div>
            </div>
            <div className="flex flex-col gap-5 w-full">
                <div className="flex flex-col gap-2">
                    <label htmlFor="value">Value</label>
                    <Input
                        id="value"
                        value={getLabel()?.value || ""}
                        onChange={(e) => {
                            setCompose(() => {
                                const label = getLabel();
                                if (label) {
                                    label.value = e.target.value;
                                }
                            });
                        }}
                    />
                </div>
            </div>
        </form>
    );
}
