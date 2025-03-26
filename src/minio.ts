import * as Minio from 'minio'

type Images =  {
  src: string
  alt: string
}

const minioClient = new Minio.Client({

  endPoint: import.meta.env.ENDPOINT,
  useSSL: true,
  accessKey: import.meta.env.ACCESS_KEY,
  secretKey: import.meta.env.SECRET_ACCESS_KEY,
})

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
export const get_data_url = async (): Promise<Images[]> => {
  var photos: Images[] = [];
  try {
    const objectNames = await get_object_name();

    if (objectNames.length > 0) {

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
        const images: Images = {
          src: presignedUrl,
          alt: objectName,
        };
        photos.push(images);
      }));
      return photos;

    } else {
      throw new Error('No object names available.');
    }
  } catch (error) {
    throw error;
  }
 };