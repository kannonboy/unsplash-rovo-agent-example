import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

// Function to save the access key securely
const resolver = new Resolver();

resolver.define('saveAccessKey', async (req) => {
  const { accessKey } = req.payload;
  
  try {
    if (!accessKey || !accessKey.trim()) {
      return {
        success: false,
        error: 'Access key is required'
      };
    }
    
    // Store the API key securely using Forge's setSecret method
    await storage.setSecret('unsplash-access-key', accessKey.trim());
    
    console.log('Access key saved successfully');
    return {
      success: true,
      message: 'Access key saved successfully'
    };
  } catch (error) {
    console.error('Error saving Access key:', error);
    return {
      success: false,
      error: 'Failed to save Access key. Please try again.'
    };
  }
});

// Resolver to check if the access key is set
resolver.define('isAccessKeySet', async () => {
  try {
    const accessKey = await storage.getSecret('unsplash-access-key');
    return {
      isSet: !!accessKey
    };
  } catch (error) {
    console.error('Error checking access key:', error);
    return {
      isSet: false,
      error: 'Failed to check access key status.'
    };
  }
});

export const handler = resolver.getDefinitions();