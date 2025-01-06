import {getMyInfos} from "@/actions/userActions";
import Settings from "@/components/display/settings";

export default async function Page() {

    const myInfos = await getMyInfos()

    return (
        <div className="container mx-auto py-10">
            <span>
                <p className="text-2xl font-bold mb-10">My settings :</p>
                <Settings init={myInfos}/>
            </span>
        </div>
    );
}