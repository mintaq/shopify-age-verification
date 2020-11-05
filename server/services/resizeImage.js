// import sharp from "sharp";

// export default async function resizeImage(image) {
//   if (image != null && image.data) {
//     let parts = image.data.split(";");
//     let mimType = parts[0].split(":")[1];
//     let imageData = parts[1].split(",")[1];

//     let buf = Buffer.from(imageData, "base64");

//     const sharpRes = await sharp(buf)
//       .webp()
//       .toBuffer()
//       .then((resizedImageBuffer) => {
//         let resizedImageData = resizedImageBuffer.toString("base64");
//         let resizedBase64 = `data:image/webp;base64,${resizedImageData}`;
//         return resizedBase64;
//       });

//     // console.log(sharpRes);
//     const newImage = { ...image, data: sharpRes };
//     return newImage;
//   } else return 0;
// }
