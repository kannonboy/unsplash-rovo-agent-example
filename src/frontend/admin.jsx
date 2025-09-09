// ============================================================================
// FORGE REACT ADMIN INTERFACE
// ============================================================================
// This component provides a configuration interface for administrators to
// set up the Rovo agent. It uses Forge UI Kit components that integrate
// seamlessly with Atlassian's design system and UI patterns.

import { useState } from 'react';
import ForgeReconciler, { 
  Box, 
  Button, 
  Form, 
  FormSection, 
  FormFooter,
  Textfield, 
  SectionMessage,
  Text,
  Link,
  Label,
  useForm
} from '@forge/react';
import { invoke } from '@forge/bridge';

/**
 * ADMIN CONFIGURATION COMPONENT
 * 
 * This React component renders in Jira's admin interface and allows
 * site administrators to configure the Rovo agent. It demonstrates:
 * - UI Kit component usage
 * - Backend communication via invoke()
 * - Form handling and validation
 * - User feedback and error handling
 */
const AdminPage = () => {
  // ========================================================================
  // COMPONENT STATE
  // ========================================================================
  // React state management for form data and UI feedback
  
  const [accessKey, setAccessKey] = useState('');      // Current API key input
  const [isLoading, setIsLoading] = useState(false);   // Loading state for async operations
  const [message, setMessage] = useState(null);        // Success/error messages
  const [messageType, setMessageType] = useState('info'); // Message appearance type

  // Forge UI Kit hook for form handling
  const { handleSubmit, getFieldId } = useForm();

  // ========================================================================
  // BACKEND COMMUNICATION
  // ========================================================================
  // The invoke() function calls backend resolvers defined in resolver.js
  // This provides secure communication between frontend and backend code.
  
  /**
   * Handle form submission to save API configuration
   * 
   * This function demonstrates the frontend-to-backend communication pattern
   * in Forge apps using the invoke() bridge function.
   */
  const onSubmit = async () => {
    // Update UI state to show loading
    setIsLoading(true);
    setMessage(null);

    try {
      // ======================================================================
      // INVOKE BACKEND RESOLVER
      // ======================================================================
      // Call the 'saveAccessKey' resolver defined in resolver.js
      // The second parameter is the payload sent to the backend function
      
      const result = await invoke('saveAccessKey', { accessKey: accessKey.trim() });

      // Handle structured response from backend
      if (result.success) {
        setMessageType('success');
        setMessage('Access key saved successfully!');
        setAccessKey(''); // Clear the form on success
      } else {
        setMessageType('error');
        setMessage(result.error || 'Failed to save access key');
      }
    } catch (error) {
      // Handle network errors or unexpected issues
      console.error('Error saving access key:', error);
      setMessageType('error');
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      // Always reset loading state
      setIsLoading(false);
    }
  };

  // ========================================================================
  // RENDER ADMIN INTERFACE
  // ========================================================================
  // This JSX uses Forge React components that automatically match
  // Atlassian's design system and handle responsive design, theming,
  // and accessibility requirements.
  
  return (
    <Box padding="medium">
      {/* Header text with external link to documentation */}
      <Text>
        Configure your Unsplash access key to enable the Rovo agent to search for photos. 
        You can get your access key from the{' '}
        <Link href="https://unsplash.com/developers" openNewTab>
          Unsplash Developers portal
        </Link>.
      </Text>

      {/* ====================================================================
          USER FEEDBACK MESSAGES
          ====================================================================
          Display success/error messages using SectionMessage component
          which provides consistent styling and accessibility features */}
      {message && (
        <SectionMessage appearance={messageType === 'success' ? 'confirmation' : 'error'}>
          <Text>{message}</Text>
        </SectionMessage>
      )}

      {/* ====================================================================
          CONFIGURATION FORM
          ====================================================================
          Forge Form components handle validation, submission, and provide
          consistent styling with other Atlassian admin interfaces */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormSection>
          <Label labelFor={getFieldId('accessKey')}>
            Unsplash Access Key
          </Label>
          <Textfield
            name="accessKey"
            label="Unsplash Access Key"
            type="password"
            placeholder="Enter your Unsplash Access key"
            value={accessKey}
            onChange={(event) => setAccessKey(event.target.value)}
            isRequired
            description="This key will be stored securely and used to authenticate requests to the Unsplash API."
          />
        </FormSection>

        <FormFooter>
          <Button 
            type="submit" 
            appearance="primary"
            isLoading={isLoading}              // Shows spinner while calling the backend
            isDisabled={!accessKey.trim()}     // Disable if no input
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </FormFooter>
      </Form>
    </Box>
  );
};

// ============================================================================
// FORGE REACT RECONCILER
// ============================================================================
// ForgeReconciler.render() is the entry point for Forge React apps.
// It renders your component tree within the Atlassian product interface
// and handles the bridge between your React code and the Forge platform.

ForgeReconciler.render(
  <AdminPage />
);