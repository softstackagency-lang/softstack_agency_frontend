// Cloudinary upload utility for client-side uploads
// Parse Cloudinary URL from environment
const CLOUDINARY_URL = process.env.CLOUDINARY_URL || 'cloudinary://926339542849374:sIAWCl3YCrb40xttX6mvo7OkhDg@dgjcfb8rs';

// Extract cloud name and API credentials from Cloudinary URL
const extractCloudinaryConfig = (url) => {
  try {
    // Format: cloudinary://api_key:api_secret@cloud_name
    const match = url.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);
    if (!match) {
      throw new Error('Invalid Cloudinary URL format');
    }
    return {
      cloudName: match[3],
      apiKey: match[1],
      apiSecret: match[2],
    };
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
};

// Generate SHA-1 signature for Cloudinary upload
const generateSignature = async (paramsToSign, apiSecret) => {
  // Sort parameters alphabetically and create string to sign
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  const stringToSign = sortedParams + apiSecret;
  
  // Use SubtleCrypto to generate SHA-1 hash
  const encoder = new TextEncoder();
  const data = encoder.encode(stringToSign);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const uploadImageToCloudinary = async (imageFile) => {
  try {
    const config = extractCloudinaryConfig(CLOUDINARY_URL);
    
    if (!config) {
      throw new Error('Cloudinary configuration not found');
    }

    // Prepare signed upload parameters
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      timestamp: timestamp,
    };

    // Generate signature
    const signature = await generateSignature(paramsToSign, config.apiSecret);

    // Create form data for upload with signature
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('api_key', config.apiKey);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to upload image');
    }

    const result = await response.json();
    
    return {
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Keep backward compatibility - export with old name
export const uploadImageToImgBB = uploadImageToCloudinary;
