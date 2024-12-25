import * as Minio from 'minio'

const minioClient = new Minio.Client({

  endPoint: import.meta.env.ENDPOINT,
  useSSL: import.meta.env.USE_SSL === 'true',
  accessKey: import.meta.env.ACCESS_KEY,
  secretKey: import.meta.env.SECRET_ACCESS_KEY,
})

let count = 0;

//バケット内に存在するオブジェクト名の一覧を取得する
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

//バケット内のオブジェクトにアクセスするためのURLを発行する
export const get_data_url = async (): Promise<string[]> => {
  var urls: string[] = [];
  try {
    // objectNamesを取得
    const objectNames = await get_object_name();
    console.log(objectNames.length);

    if (objectNames.length > 0) {

      // const limitedObjectNames = objectNames.slice(0, 15);
      // await Promise.all(limitedObjectNames .map(async (objectName) => {
        await Promise.all(objectNames.map(async (objectName) => {

        const data_name = objectName;
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
                resolve(url as string);
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