const getDataUri = async (url, width, height) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const aspectRatio = image.naturalWidth / image.naturalHeight;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      const imgWidth = aspectRatio > 1 ? width : height * aspectRatio;
      const imgHeight = aspectRatio > 1 ? width / aspectRatio : height;

      canvas.width = width;
      canvas.height = height;

      context.drawImage(
        image,
        (width - imgWidth) / 2,
        (height - imgHeight) / 2,
        imgWidth,
        imgHeight
      );

      context.globalCompositeOperation = "destination-in";
      context.beginPath();
      context.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
      context.fill();

      resolve(canvas.toDataURL("image/png"));
    };

    image.onerror = () => resolve(ONE_PX_IMAGE64);
    image.src = url;
  });
};
