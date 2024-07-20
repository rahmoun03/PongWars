import {
  Color,
  DataUtils,
  HalfFloatType,
  LightProbe,
  LinearSRGBColorSpace,
  NoColorSpace,
  SRGBColorSpace,
  SphericalHarmonics3,
  Vector3
} from "./chunk-LCF6B46P.js";

// node_modules/three/examples/jsm/lights/LightProbeGenerator.js
var LightProbeGenerator = class {
  // https://www.ppsloan.org/publications/StupidSH36.pdf
  static fromCubeTexture(cubeTexture) {
    let totalWeight = 0;
    const coord = new Vector3();
    const dir = new Vector3();
    const color = new Color();
    const shBasis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sh = new SphericalHarmonics3();
    const shCoefficients = sh.coefficients;
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      const image = cubeTexture.image[faceIndex];
      const width = image.width;
      const height = image.height;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, width, height);
      const imageData = context.getImageData(0, 0, width, height);
      const data = imageData.data;
      const imageWidth = imageData.width;
      const pixelSize = 2 / imageWidth;
      for (let i = 0, il = data.length; i < il; i += 4) {
        color.setRGB(data[i] / 255, data[i + 1] / 255, data[i + 2] / 255);
        convertColorToLinear(color, cubeTexture.colorSpace);
        const pixelIndex = i / 4;
        const col = -1 + (pixelIndex % imageWidth + 0.5) * pixelSize;
        const row = 1 - (Math.floor(pixelIndex / imageWidth) + 0.5) * pixelSize;
        switch (faceIndex) {
          case 0:
            coord.set(-1, row, -col);
            break;
          case 1:
            coord.set(1, row, col);
            break;
          case 2:
            coord.set(-col, 1, -row);
            break;
          case 3:
            coord.set(-col, -1, row);
            break;
          case 4:
            coord.set(-col, row, 1);
            break;
          case 5:
            coord.set(col, row, -1);
            break;
        }
        const lengthSq = coord.lengthSq();
        const weight = 4 / (Math.sqrt(lengthSq) * lengthSq);
        totalWeight += weight;
        dir.copy(coord).normalize();
        SphericalHarmonics3.getBasisAt(dir, shBasis);
        for (let j = 0; j < 9; j++) {
          shCoefficients[j].x += shBasis[j] * color.r * weight;
          shCoefficients[j].y += shBasis[j] * color.g * weight;
          shCoefficients[j].z += shBasis[j] * color.b * weight;
        }
      }
    }
    const norm = 4 * Math.PI / totalWeight;
    for (let j = 0; j < 9; j++) {
      shCoefficients[j].x *= norm;
      shCoefficients[j].y *= norm;
      shCoefficients[j].z *= norm;
    }
    return new LightProbe(sh);
  }
  static fromCubeRenderTarget(renderer, cubeRenderTarget) {
    let totalWeight = 0;
    const coord = new Vector3();
    const dir = new Vector3();
    const color = new Color();
    const shBasis = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    const sh = new SphericalHarmonics3();
    const shCoefficients = sh.coefficients;
    const dataType = cubeRenderTarget.texture.type;
    for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
      const imageWidth = cubeRenderTarget.width;
      let data;
      if (dataType === HalfFloatType) {
        data = new Uint16Array(imageWidth * imageWidth * 4);
      } else {
        data = new Uint8Array(imageWidth * imageWidth * 4);
      }
      renderer.readRenderTargetPixels(cubeRenderTarget, 0, 0, imageWidth, imageWidth, data, faceIndex);
      const pixelSize = 2 / imageWidth;
      for (let i = 0, il = data.length; i < il; i += 4) {
        let r, g, b;
        if (dataType === HalfFloatType) {
          r = DataUtils.fromHalfFloat(data[i]);
          g = DataUtils.fromHalfFloat(data[i + 1]);
          b = DataUtils.fromHalfFloat(data[i + 2]);
        } else {
          r = data[i] / 255;
          g = data[i + 1] / 255;
          b = data[i + 2] / 255;
        }
        color.setRGB(r, g, b);
        convertColorToLinear(color, cubeRenderTarget.texture.colorSpace);
        const pixelIndex = i / 4;
        const col = -1 + (pixelIndex % imageWidth + 0.5) * pixelSize;
        const row = 1 - (Math.floor(pixelIndex / imageWidth) + 0.5) * pixelSize;
        switch (faceIndex) {
          case 0:
            coord.set(1, row, -col);
            break;
          case 1:
            coord.set(-1, row, col);
            break;
          case 2:
            coord.set(col, 1, -row);
            break;
          case 3:
            coord.set(col, -1, row);
            break;
          case 4:
            coord.set(col, row, 1);
            break;
          case 5:
            coord.set(-col, row, -1);
            break;
        }
        const lengthSq = coord.lengthSq();
        const weight = 4 / (Math.sqrt(lengthSq) * lengthSq);
        totalWeight += weight;
        dir.copy(coord).normalize();
        SphericalHarmonics3.getBasisAt(dir, shBasis);
        for (let j = 0; j < 9; j++) {
          shCoefficients[j].x += shBasis[j] * color.r * weight;
          shCoefficients[j].y += shBasis[j] * color.g * weight;
          shCoefficients[j].z += shBasis[j] * color.b * weight;
        }
      }
    }
    const norm = 4 * Math.PI / totalWeight;
    for (let j = 0; j < 9; j++) {
      shCoefficients[j].x *= norm;
      shCoefficients[j].y *= norm;
      shCoefficients[j].z *= norm;
    }
    return new LightProbe(sh);
  }
};
function convertColorToLinear(color, colorSpace) {
  switch (colorSpace) {
    case SRGBColorSpace:
      color.convertSRGBToLinear();
      break;
    case LinearSRGBColorSpace:
    case NoColorSpace:
      break;
    default:
      console.warn("WARNING: LightProbeGenerator convertColorToLinear() encountered an unsupported color space.");
      break;
  }
  return color;
}

export {
  LightProbeGenerator
};
//# sourceMappingURL=chunk-KGQ5CB5M.js.map
