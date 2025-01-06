"use server"

export default async function CoreBanner() {

    if(!process.env.CORE_ONLY){
        return <></>
    }

    return (
        <div className="flex flex-row w-full bg-blue-100 items-center py-1 px-10 justify-between">
            <span></span>
            <p>🔒 This instance is self-hosted. 🔒</p>
            <span></span>
        </div>
    );
}
