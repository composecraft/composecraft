"use client"

import { create } from 'zustand';
import { Compose, Translator } from "@composecraft/docker-compose-lib";
import { generateRandomName } from "@/lib/utils";
import { registerCompose } from "@/actions/userActions";
import useComposeIdStore from "@/store/composeId";
import toast from "react-hot-toast";
import usePositionMap from "@/store/metadataMap";
import { extractMetadata } from "@/lib/metadata";
import useDisableStateStore from "@/store/disabled";

interface ComposeState {
    compose: Compose;
    setCompose: (updater: (currentCompose: Compose) => void) => Promise<boolean>;
    replaceCompose: (newCompose: Compose, options?: { disableSave?: boolean }) => void;
}

export async function save(compose: Compose) {
    const { id: composeId, setId } = useComposeIdStore.getState();
    const translator = new Translator(compose)
    const id = await registerCompose(
        translator.toDict(),
        extractMetadata(compose, usePositionMap.getState().positionMap),
        composeId
    )
    setId(id)
}

export const useComposeStore = create<ComposeState>((set) => {
    let lastCallTime = Date.now()

    const shouldPerformCustom = () => {
        return Date.now() - lastCallTime > 3000;
    };

    return {
        compose: new Compose({ name: generateRandomName() }),
        setCompose: (updater: (currentCompose: Compose) => void) => {
            return new Promise((resolve) => {
                set((state) => {
                    const { state:disabledSave } = useDisableStateStore.getState();
                    const previousHash = state.compose.hash()
                    updater(state.compose);
                    const newHash = state.compose.hash()
                    const hasCHanged = newHash !== previousHash
                    // Only save if not explicitly disabled
                    if (!disabledSave) {
                        setTimeout(() => {
                            const a = shouldPerformCustom()
                            if (a && hasCHanged) {
                                toast.promise(
                                    save(state.compose),
                                    {
                                        loading: 'Saving...',
                                        success: "Saved",
                                        error: "Error on save"
                                    }
                                )
                            }
                        }, 3000)
                    }

                    lastCallTime = Date.now();
                    // Resolve the promise immediately with the hasCHanged value
                    resolve(hasCHanged);
                    return { compose: state.compose };
                });
            });
        },
        replaceCompose: (newCompose: Compose) => {
            set((state) => {
                const { state:disabledSave } = useDisableStateStore.getState();
                const previousHash = state.compose.hash()
                const hasCHanged = newCompose.hash() === previousHash
                lastCallTime = Date.now();

                if (!newCompose.name) {
                    newCompose.name = generateRandomName()
                }

                // Only save if not explicitly disabled
                if (!disabledSave) {
                    if (hasCHanged) {
                        setTimeout(() => {
                            toast.promise(
                                save(newCompose),
                                {
                                    loading: 'Saving...',
                                    success: "Saved",
                                    error: "Error on save"
                                }
                            )
                        }, 3000)
                    }
                }

                return { compose: newCompose };
            });
        }
    };
});
