// ============================================================================
// FORGE RESOLVERS - ADMIN INTERFACE BACKEND
// ============================================================================
// Resolvers handle backend logic for Forge UI components. They're called
// from UI Kit components using the invoke() function and provide a secure
// way to handle configuration, data processing, and API interactions.

import Resolver from '@forge/resolver';
import { storage } from '@forge/api';

// ============================================================================
// RESOLVER SETUP
// ============================================================================
// The Resolver class provides a framework for defining backend functions
// that can be called from frontend components. Each resolver function
// receives a request object with payload data from the UI.

const resolver = new Resolver();

/**
 * ADMIN FUNCTION: Save API Configuration
 * 
 * Securely stores the Unsplash access key for the Rovo agent to use.
 * This demonstrates Forge's secure storage capabilities.
 * 
 * @param {Object} req - Request object from frontend
 * @param {Object} req.payload - Data sent from React component
 * @param {string} req.payload.accessKey - Unsplash API access key
 * @returns {Object} Success/error response for the frontend
 */
resolver.define('saveAccessKey', async (req) => {
  const { accessKey } = req.payload;
  
  try {
    // ========================================================================
    // INPUT VALIDATION
    // ========================================================================
    // Always validate data from frontend components, even though the UI
    // may have client-side validation.
    
    if (!accessKey || !accessKey.trim()) {
      return {
        success: false,
        error: 'Access key is required'
      };
    }
    
    // ========================================================================
    // SECURE STORAGE
    // ========================================================================
    // Forge's setSecret() method encrypts sensitive data and stores it
    // securely.
    
    await storage.setSecret('unsplash-access-key', accessKey.trim());
    
    console.log('Access key saved successfully');
    return {
      success: true,
      message: 'Access key saved successfully'
    };
  } catch (error) {
    // Log detailed error for debugging, return user-friendly message
    console.error('Error saving Access key:', error);
    return {
      success: false,
      error: 'Failed to save Access key. Please try again.'
    };
  }
});

/**
 * ADMIN FUNCTION: Check Configuration Status
 * 
 * Checks if the required API key has been configured. This allows the
 * admin UI to show appropriate status messages and guide administrators
 * through the setup process.
 * 
 * @returns {Object} Configuration status information
 */
resolver.define('isAccessKeySet', async () => {
  try {
    const accessKey = await storage.getSecret('unsplash-access-key');
    return {
      isSet: !!accessKey  // Convert to boolean - true if key exists
    };
  } catch (error) {
    console.error('Error checking access key:', error);
    return {
      isSet: false,
      error: 'Failed to check access key status.'
    };
  }
});

// ============================================================================
// EXPORT RESOLVER DEFINITIONS
// ============================================================================
// This exports all defined resolver functions so they can be called
// from frontend components. The handler is registered in manifest.yml
// under the 'function' module.

export const handler = resolver.getDefinitions();