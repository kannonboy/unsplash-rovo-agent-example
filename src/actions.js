// ============================================================================
// FORGE ACTIONS - ROVO AGENT IMPLEMENTATION
// ============================================================================
// This file contains the custom actions that your Rovo agent can execute.
// Actions are the bridge between natural language instructions and actual
// API calls or data processing. The LLM calls these functions with structured
// parameters based on the action definitions in manifest.yml.

import { storage } from '@forge/api';

/**
 * MAIN ACTION: Search Photos
 * 
 * This function is called by the Rovo agent when it needs to search for photos.
 * The agent's LLM determines when to call this action based on user requests
 * and passes the appropriate parameters.
 * 
 * @param {Object} payload - Parameters from the agent's LLM
 * @param {string} payload.query - Search terms for photos
 * @param {string} [payload.color] - Optional color filter
 * @param {string} [payload.orientation] - Optional orientation filter
 * @returns {Object} Structured response for the agent to process
 */
export async function searchPhotos(payload) {
  console.log(`searchPhotos called with payload: ${JSON.stringify(payload)}`);
  
  try {
    // ========================================================================
    // SECURE CONFIGURATION RETRIEVAL
    // ========================================================================
    // Forge provides secure secret storage for sensitive data like API keys.
    
    const accessKey = await storage.getSecret('unsplash-access-key');
    
    if (!accessKey) {
      // Return structured error that the agent can communicate to users
      return {
        error: 'Unsplash access key not configured. Please contact your administrator to set up the access key.',
        status: 'error'
      };
    }
    
    // ========================================================================
    // INPUT VALIDATION
    // ========================================================================
    // Always validate inputs from the LLM, even though the action schema
    // provides some validation. This ensures robust error handling.
    
    const { query, color, orientation } = payload;
    
    if (!query) {
      return {
        error: 'Search query is required',
        status: 'error'
      };
    }
    
    // ========================================================================
    // EXTERNAL API INTEGRATION
    // ========================================================================
    // Build the external API request. Note that the domain must be allowlisted
    // in manifest.yml under permissions.external.fetch for security.
    
    const baseUrl = 'https://api.unsplash.com/search/photos';
    const params = new URLSearchParams({
      query: query,
      per_page: '10', // Limit results for better performance and user experience
      client_id: accessKey
    });
    
    // Add optional filters - demonstrates how to handle optional parameters
    if (color) {
      params.append('color', color);
    }
    
    if (orientation) {
      params.append('orientation', orientation);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    // ========================================================================
    // HTTP REQUEST EXECUTION
    // ========================================================================
    // Forge allows HTTP requests to whitelisted domains. Always include
    // proper error handling for network issues and API errors.
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // ========================================================================
    // ERROR HANDLING
    // ========================================================================
    // Comprehensive error handling helps create a robust user experience.
    // Different error types should provide specific, actionable messages.
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', response.status, errorText);
      
      // Handle specific HTTP status codes with user-friendly messages
      if (response.status === 401) {
        return {
          error: 'Invalid access key. Please contact your administrator to update the Unsplash access key.',
          status: 'error'
        };
      }
      
      return {
        error: `Unsplash API error: ${response.status}`,
        status: 'error'
      };
    }
    
    const data = await response.json();
    
    // ========================================================================
    // DATA TRANSFORMATION FOR ROVO AGENT
    // ========================================================================
    // Transform external API responses into a format that's useful for the
    // Rovo agent and easy for users to understand. Include metadata that
    // helps the LLM provide better responses.
    
    if (data.results && data.results.length > 0) {
      // Transform raw API data into agent-friendly format
      const photos = data.results.map(photo => ({
        id: photo.id,
        description: photo.description || photo.alt_description || 'Untitled',
        url: photo.urls.regular,          // Full-size image URL
        thumbnail: photo.urls.thumb,       // Thumbnail for quick preview
        photographer: photo.user.name,     // Attribution information
        photographer_url: photo.user.links.html,
        download_url: photo.links.download_location
      }));
      
      // Return structured success response
      return {
        status: 'success',
        total: data.total,
        results: photos,
        message: `Found ${data.total} photos for "${query}"`
      };
    } else {
      // Handle empty results gracefully
      return {
        status: 'success',
        total: 0,
        results: [],
        message: `No photos found for "${query}". Try different search terms.`
      };
    }
    
  } catch (error) {
    // ========================================================================
    // GENERAL ERROR HANDLING
    // ========================================================================
    // Catch-all for network errors, parsing errors, or unexpected issues.
    // Log detailed information for debugging while providing user-friendly messages.
    
    console.error('Error searching photos:', error);
    return {
      error: 'Failed to search photos. Please try again later.',
      status: 'error'
    };
  }
}
