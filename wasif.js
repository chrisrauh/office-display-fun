ready.on(() => {
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');

  const drawImageActualSize = () => {
    ctx.drawImage(image, 200, 200);
  }

  const image = new Image(200, 200);
  image.onload = drawImageActualSize;

  image.src = './assets/matt.jpg';
});
