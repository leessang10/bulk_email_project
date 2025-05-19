import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

// 환경 변수 검증
const validateEnvVariables = () => {
  const required = {
    region: import.meta.env.VITE_AWS_REGION,
    bucket: import.meta.env.VITE_AWS_S3_BUCKET,
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return required;
};

const { region, bucket, accessKeyId, secretAccessKey } = validateEnvVariables();

console.log("S3 Config:", {
  region,
  bucket,
  hasAccessKey: !!accessKeyId,
  hasSecretKey: !!secretAccessKey,
});

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

const BUCKET_NAME = bucket;

// Blob을 Uint8Array로 변환하는 함수
const blobToUint8Array = async (blob: Blob): Promise<Uint8Array> => {
  const arrayBuffer = await blob.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};

// 이미지 리사이징 함수
const resizeImageFile = async (
  file: File,
  maxWidth = 800,
  maxHeight = 800
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read file"));
    img.onerror = () => reject(new Error("Failed to load image"));

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // 이미지가 최대 크기보다 작으면 리사이징하지 않음
        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
          return;
        }

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob from canvas"));
              return;
            }
            resolve(blob);
          },
          file.type,
          0.85
        );
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsDataURL(file);
  });
};

export const uploadImageToS3 = async (file: File): Promise<string> => {
  try {
    console.log("Starting image upload:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      throw new Error("Invalid file type. Only images are allowed.");
    }

    const fileExtension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExtension}`;

    // 이미지 리사이징
    console.log("Resizing image...");
    const resizedImageBlob = await resizeImageFile(file);
    console.log("Image resized:", {
      originalSize: file.size,
      resizedSize: resizedImageBlob.size,
    });

    // Blob을 Uint8Array로 변환
    console.log("Converting Blob to Uint8Array...");
    const uint8Array = await blobToUint8Array(resizedImageBlob);
    console.log("Conversion complete, array size:", uint8Array.length);

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: uint8Array,
      ContentType: file.type,
      ACL: ObjectCannedACL.public_read,
    };

    console.log("Preparing S3 upload with params:", {
      Bucket: uploadParams.Bucket,
      Key: uploadParams.Key,
      ContentType: uploadParams.ContentType,
      BodySize: uint8Array.length,
    });

    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);

    console.log("S3 upload response:", response);

    // 업로드된 이미지의 URL 생성
    //https://s3.ap-northeast-2.amazonaws.com/tlooto.com/images/1747637644383-pt9ns8.jpg
    const imageUrl = `https://s3.${region}.amazonaws.com/${BUCKET_NAME}/images/${fileName}`;
    console.log("Generated image URL:", imageUrl);

    return imageUrl;
  } catch (error: any) {
    console.error("Failed to upload image to S3:", {
      error: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
      details: error.$metadata,
    });
    throw new Error(`이미지 업로드에 실패했습니다: ${error.message}`);
  }
};
