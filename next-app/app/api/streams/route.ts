import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { json } from "stream/consumers";
import { number, z } from "zod"
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

var YT_REGEX = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/

const createStreamSchema = z.object({
    creatorId: z.string(),
    url:       z.string()
})

export async function POST(req: NextRequest) {
    try {
        const data = createStreamSchema.parse(await req.json())
        const isYt = data.url.match(YT_REGEX)
        if(!isYt){
            return NextResponse.json({
                msg: "u have sent somthing different"
            },{
                status: 411
            })
        }
        
        const extractedId = data.url.split("?v=")[1]
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails
        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1)

        const stream = await prismaClient.strem.create({
            data: {
                userId: data.creatorId ,
                url: data.url,
                extractedId,
                type: "Youtube",
                title: res.title,
                bigImg: thumbnails[thumbnails.length - 1].url,
                smallImg: thumbnails[thumbnails.length - 2].url
            }
        })
        return NextResponse.json({
            msg: "stream Added",
            id: stream.id
        })

    }catch(e) {
        return NextResponse.json({
            msg: "Error while adding stream"
        }, {
            status: 411
        })
    }
}