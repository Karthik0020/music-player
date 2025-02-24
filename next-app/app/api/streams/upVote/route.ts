import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

const upVoteSchema = z.object({
    StreamId: z.string()
    
})

export async function POST( req: NextRequest) {
    const session = await getServerSession()

    const user = await prismaClient.user.findFirst({
        where:{
            email: session?.user?.email ?? ""
        }
    })

    if (!user) {
        return NextResponse.json({
            msg: "unauthorized"
        },{
            status: 411
        })
    }
    
    try {
        const data = upVoteSchema.parse(await req.json())
        await prismaClient.upvotes.create({
            data: {
                userId: user.id,
                streamId: data.StreamId
            }
        })
    } catch(e) {
        return NextResponse.json({
            msg: "down voting "
        },{
            status: 411
        })
    }
} 

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId")
    const stream = await prismaClient.strem.findMany({
        where: {
            userId: creatorId || ""
        }
    })

    return NextResponse.json({
        stream
    })
}