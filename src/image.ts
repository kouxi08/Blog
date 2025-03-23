import url from 'node:url'
import http from 'node:http'
import { imageSize } from 'image-size'
import type { Photo } from "react-photo-album";

const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

export async function get_photo(image: string):Promise<Photo> {
    try {
        const results = await get_image_size(image)
        const images: Photo = {
            src: image,
            width: results.width,
            height: results.height,
            srcSet: breakpoints.map((breakpoint) => ({
                src: image,
                width: breakpoint,
                height: Math.round((results.height / results.width) * breakpoint),
            }))
        }
        // console.log("srcSet:", JSON.stringify(images.srcSet, null, 2));
        return images
    }catch(error){
        throw error;
    }
}

export async function get_image_size(imgUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const options = url.parse(imgUrl);

        http.get(options, (response) => {
        const chunks: any[] = [];

            response
                .on('data', (chunk) => {
                chunks.push(chunk);
                })
                .on('end', () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    const dimensions = imageSize(buffer);
                    // console.log(dimensions.height, dimensions.width)

                    if (!dimensions.width || !dimensions.height) {
                    reject(new Error('Could not determine image size.'));
                    return;
                    }
                    resolve({
                    width: dimensions.width,
                    height: dimensions.height,
                    });
                } catch (err) {
                    reject(err);
                }
                })
                .on('error', (err) => {
                    reject(err);
                });
        }).on('error', (err) => {
            reject(err);
        });
    });
}
