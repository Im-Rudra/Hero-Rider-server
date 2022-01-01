const imgBuffer = (img) => {
  const imgData = img?.data;
  const encodedImg = imgData.toString('base64');
  const buffer = Buffer.from(encodedImg, 'base64');
  return buffer;
};

const bufferObj = (files) => {
  let tempObj = {};
  for (const property in files) {
    tempObj = { ...tempObj, [property]: imgBuffer(files[property]) };
  }
  return tempObj;
};

module.exports = bufferObj;
