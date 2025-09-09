import { storage } from '@forge/api';

export async function searchPhotos(payload) {
  console.log(`searchPhotos called with payload: ${JSON.stringify(payload)}`);
  
  try {
    // Get the Access key from secure storage
    const accessKey = await storage.getSecret('unsplash-access-key');
    
    if (!accessKey) {
      return {
        error: 'Unsplash access key not configured. Please contact your administrator to set up the access key.',
        status: 'error'
      };
    }
    
    // Extract parameters from payload
    const { query, color, orientation } = payload;
    
    if (!query) {
      return {
        error: 'Search query is required',
        status: 'error'
      };
    }
    
    // Build the Unsplash API URL
    const baseUrl = 'https://api.unsplash.com/search/photos';
    const params = new URLSearchParams({
      query: query,
      per_page: '10', // Limit to 10 results
      client_id: accessKey
    });
    
    // Add optional filters
    if (color) {
      params.append('color', color);
    }
    
    if (orientation) {
      params.append('orientation', orientation);
    }
    
    const url = `${baseUrl}?${params.toString()}`;
    
    // Make the API call to Unsplash
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', response.status, errorText);
      
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
    
    // Format the response for the Rovo agent
    if (data.results && data.results.length > 0) {
      const photos = data.results.map(photo => ({
        id: photo.id,
        description: photo.description || photo.alt_description || 'Untitled',
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        photographer: photo.user.name,
        photographer_url: photo.user.links.html,
        download_url: photo.links.download_location
      }));
      
      return {
        status: 'success',
        total: data.total,
        results: photos,
        message: `Found ${data.total} photos for "${query}"`
      };
    } else {
      return {
        status: 'success',
        total: 0,
        results: [],
        message: `No photos found for "${query}". Try different search terms.`
      };
    }
    
  } catch (error) {
    console.error('Error searching photos:', error);
    return {
      error: 'Failed to search photos. Please try again later.',
      status: 'error'
    };
  }
}
