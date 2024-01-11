import * as Minio from 'minio'

const minioClient = new Minio.Client({

  endPoint: import.meta.env.ENDPOINT,
  port: parseInt(import.meta.env.MINIO_PORT),
  useSSL: import.meta.env.USESSL === 'true',
  accessKey: import.meta.env.ACCESS_KEY,
  secretKey: import.meta.env.SECRET_ACCESS_KEY,
})



export const get_object_name = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const objectNames: string[] = [];
    const stream = minioClient.listObjectsV2('images', '', true, '');

    stream.on('data', (obj) => {
      if (obj.name !== undefined) {
        objectNames.push(obj.name);
      }
    });

    stream.on('end', () => {
      resolve(objectNames);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
};
export const get_data_url = async (): Promise<string[]> => {
  var urls: string[] = [];
  try {
    // objectNamesを取得
    const objectNames = await get_object_name();
    console.log(objectNames);

    // objectNamesが空でないことを確認
    if (objectNames.length > 0) {
      await Promise.all(objectNames.map(async (objectName) => {
        const data_name = objectName; // 一つ目の要素を使用
        const presignedUrl = await new Promise<string>((resolve, reject) => {
          minioClient.presignedUrl(
            'GET',
            'images',
            `${data_name}`,
            1000,
            { prefix: 'data', 'max-keys': 500 },
            function (err, url) {
              if (err) {
                reject(err);
              } else {
                resolve(url as string); // explicitly cast to string
              }
            },
          );
        });
        urls.push(presignedUrl);
      }));
      return urls;
    } else {
      throw new Error('No object names available.');
    }
  } catch (error) {
    throw error;
  }
};