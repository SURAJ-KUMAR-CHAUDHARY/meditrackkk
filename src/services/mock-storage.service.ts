
export interface MockUploadResult {
  url: string;
  key: string;
  name: string;
}

/**
 * Simulates a file upload to a storage service.
 * Uses URL.createObjectURL to create a local preview URL.
 */
export const uploadFileToMockS3 = async (file: File): Promise<MockUploadResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const blobUrl = URL.createObjectURL(file);
      const timestamp = Date.now();
      const key = `mock-file-id-${timestamp}`;
      
      console.log(`[Mock Storage] Uploaded ${file.name} to ${blobUrl}`);
      
      resolve({
        url: blobUrl,
        key: key,
        name: file.name
      });
    }, 2000); // 2-second simulated delay
  });
};
