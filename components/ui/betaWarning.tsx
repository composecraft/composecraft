import {Card, CardContent} from "@/components/ui/card";
import {FlaskConical} from "lucide-react";

export default function BetaWarning(){

    return(
        <Card className="my-5">
            <CardContent className="flex flex-row gap-3 p-3 bg-slate-100 text-slate-500">
                <FlaskConical />
                <p>This software is in beta, features may not work or bug could happened, please help us improve this software and share any bug you find.</p>
            </CardContent>
        </Card>
    )
}