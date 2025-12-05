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
 * Upload a file to AWS S3
 */
export const uploadFileToS3 = async (
  file: File,
  userId: string,
  documentType: string
): Promise<UploadResult> => {
  try {
    // Generate unique file key
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileKey = `medical-records/${userId}/${documentType}/${timestamp}-${randomString}.${fileExtension}`;

    // Prepare upload parameters
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileKey,
      Body: file,
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadDate: new Date().toISOString(),
        documentType: documentType,
        userId: userId,
      },
    };

    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

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
