import imagekit from '@imagekit/nodejs'
import { config } from '../config/config'

const client = new imagekit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
})

export async function uploadFile(buffer, fileName, folder= "wearza") {
    const result = await client.files.upload({
        file: await imagekit.toFile(buffer),
        fileName: fileName,
        folder: folder
    })
    
    return result
}