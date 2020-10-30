import sharp from 'sharp'

export default async function resizeImage(bgImage, logo) {
  if (bgImage != null && bgImage.data) {
    let parts = bgImage.data.split(';');
    let mimType = parts[0].split(':')[1];
    let imageData = parts[1].split(',')[1];

    let buf = Buffer.from(imageData, 'base64');
    // let dataBase64 = Buffer.from(buf).toString("base64");
    // console.log(dataBase64);

    const sharpRes = await sharp(buf).webp().toBuffer()

    console.log(sharpRes)
    return 1;
  }
}