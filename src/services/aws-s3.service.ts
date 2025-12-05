import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS S3 Configuration
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    sessionToken: import.meta.env.VITE_AWS_SESSION_TOKEN,
  },
});

const BUCKET_NAME = import.meta.env.VITE_AWS_S3_BUCKET;

export interface UploadResult {
  fileUrl: string;
  fileKey: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

/**
 * Low-level function to upload a file with a specific key
 */
export const uploadRawFileToS3 = async (
  file: File,
  key: string
) => {
  try {
    // 1. Convert File to ArrayBuffer to avoid "getReader" stream errors
    const fileBuffer = await file.arrayBuffer();

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: new Uint8Array(fileBuffer),
      ContentType: file.type,
      ContentLength: file.size,
    };

    const command = new PutObjectCommand(uploadParams);
    const response = await s3Client.send(command);
    console.log("✅ Upload successful:", response);
    return response;
  } catch (error) {
    console.error("❌ Upload failed:", error);
    throw error;
  }
};

/**
 * Upload a file to AWS S3
 */
export const uploadFileToS3 = async (
  file: File,
  userId: string,
  documentType: string
): Promise<UploadResult> => {
  try {
    // Check if AWS credentials are provided
    if (!import.meta.env.VITE_AWS_ACCESS_KEY_ID || !import.meta.env.VITE_AWS_SECRET_ACCESS_KEY) {
      console.warn('AWS Credentials missing, using mock upload');
      return new Promise((resolve) => {
        setTimeout(() => {
          const timestamp = Date.now();
          const randomString = Math.random().toString(36).substring(2, 15);
          const fileExtension = file.name.split('.').pop();
          const fileKey = `mock/medical-records/${userId}/${documentType}/${timestamp}-${randomString}.${fileExtension}`;
          
          resolve({
            fileUrl: `https://mock-s3-bucket.s3.amazonaws.com/${fileKey}`,
            fileKey: fileKey,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          });
        }, 2000); // Mock 2s delay
      });
    }

    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileKey = `medical-records/${userId}/${documentType}/${timestamp}-${randomString}.${fileExtension}`;

    // Use the low-level upload function
    await uploadRawFileToS3(file, fileKey);

    // Generate the file URL
    const fileUrl = `https://${BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      fileUrl,
      fileKey,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file to AWS S3. Please try again.');
  }
};

/**
 * Generate a pre-signed URL for temporary file access (for QR codes)
 */
export const generatePresignedUrl = async (
  fileKey: string,
  expiresIn: number = 3600 // Default: 1 hour
): Promise<string> => {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return presignedUrl;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    throw new Error('Failed to generate access link');
  }
};

/**
 * Upload multiple files to S3
 */
export const uploadMultipleFiles = async (
  files: File[],
  userId: string,
  documentType: string,
  onProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> => {
  const results: UploadResult[] = [];
  
  for (let i = 0; i < files.length; i++) {
    const result = await uploadFileToS3(files[i], userId, documentType);
    results.push(result);
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }
  }
  
  return results;
};

/**
 * Check if AWS credentials are configured
 */
export const isAWSConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_AWS_REGION &&
    import.meta.env.VITE_AWS_ACCESS_KEY_ID &&
    import.meta.env.VITE_AWS_SECRET_ACCESS_KEY &&
    import.meta.env.VITE_AWS_S3_BUCKET
  );
};
