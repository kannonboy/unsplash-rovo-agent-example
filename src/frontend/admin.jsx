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

const AdminPage = () => {
  const [accessKey, setAccessKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  const { handleSubmit, getFieldId } = useForm();

  // Function to save the access key
  const onSubmit = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await invoke('saveAccessKey', { accessKey: accessKey.trim() });

      if (result.success) {
        setMessageType('success');
        setMessage('Access key saved successfully!');
        setAccessKey(''); // Clear the form
      } else {
        setMessageType('error');
        setMessage(result.error || 'Failed to save access key');
      }
    } catch (error) {
      console.error('Error saving access key:', error);
      setMessageType('error');
      setMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box padding="medium">
        <Text>
          Configure your Unsplash access key to enable the Rovo agent to search for photos. 
          You can get your access key from the{' '}
          <Link href="https://unsplash.com/developers" openNewTab>
            Unsplash Developers portal
          </Link>.
        </Text>

      {/* Display success/error messages */}
      {message && (
        <SectionMessage appearance={messageType === 'success' ? 'confirmation' : 'error'}>
          <Text>{message}</Text>
        </SectionMessage>
      )}

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
            isLoading={isLoading}
            isDisabled={console.log("accessKey:", accessKey) || !accessKey.trim()}
          >
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </FormFooter>
      </Form>
    </Box>
  );
};

ForgeReconciler.render(
  <AdminPage />
);