const getDataUri = async (url, width, height) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        
        if (!context) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        const aspectRatio = image.naturalWidth / image.naturalHeight;
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
      } catch (error) {
        console.error('Error processing image:', error);
        reject(error);
      }
    };

    image.onerror = (error) => {
      console.error('Error loading image:', error);
      reject(error);
    };

    image.src = url;
  });
};
