"use client"

import {Card, CardContent} from "@/components/ui/card";
import EmbedSignin from "@/components/display/embedSignin";

export default function Index() {


  return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4">
          <CardContent className="p-5">
            <EmbedSignin />
          </CardContent>
        </Card>
      </div>
  );
}