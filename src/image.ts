import url from 'node:url'
import https from 'https'
import http from 'http'
import { imageSize } from 'image-size'
import type { Photo } from "react-photo-album";

export async function get_photo(image: string): Promise<Photo> {
    try {
        const results = await get_image_size(image)
        const images: Photo = {
            src: image,
            width: results.width,
            height: results.height,
        }

        return images
    } catch (error) {
        throw error;
    }
}

export async function get_image_size(imgUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const parsedUrl = url.parse(imgUrl);
        const client = parsedUrl.protocol === 'https:' ? https : http;

        client.get(parsedUrl, (response) => {
            const chunks: any[] = [];

            response
                .on('data', (chunk) => {
                    chunks.push(chunk);
                })
                .on('end', () => {
                    try {
                        const buffer = Buffer.concat(chunks);
                        const dimensions = imageSize(buffer);

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
