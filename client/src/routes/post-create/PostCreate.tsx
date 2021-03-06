import styled from 'styled-components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { t, Trans } from '@lingui/macro';

import { Text, TextInput, Stack, FillButton } from '~uikit';
import { useCreatePostMutation } from '~graphql';

export default function PostCreatePage() {
  const [formValues, setFormValues] = useState({
    subject: '',
    author: '',
    content: '',
  });

  const submitDisabled = Object.values(formValues).some(p => !p);
  const [createPost, createPostState] = useCreatePostMutation();
  const navigate = useNavigate();

  function handleChange(event: any) {
    const { value, name } = event.target;
    setFormValues(p => ({ ...p, [name]: value }));
  }

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (submitDisabled) return;

    try {
      await createPost({
        variables: {
          subject: formValues.subject,
          author: formValues.author,
          content: formValues.content,
        },
      });

      navigate('/blog');

      toast.success(t`New blog post added`);
    } catch (error) {
      console.log('> Failed to create a new post', error);
      toast.error(t`Failed to add new blog post`);
    }
  }

  return (
    <Wrapper>
      <Stack axis="y" spacing="large">
        <Text variant="title1">
          <Trans>New blog post</Trans>
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack axis="y" spacing="normal">
            <TextInput
              label={t`Subject`}
              name="subject"
              value={formValues.subject}
              onChange={handleChange}
            />

            <TextInput
              label={t`Author`}
              name="author"
              value={formValues.author}
              onChange={handleChange}
            />

            <TextInput
              label={t`Content`}
              name="content"
              value={formValues.content}
              onChange={handleChange}
              as="textarea"
              {...({ rows: 4 } as any)}
            />

            <FillButton
              type="submit"
              variant="primary"
              loading={createPostState.loading}
              disabled={submitDisabled}
              style={{ alignSelf: 'flex-end' }}
            >
              {createPostState.loading ? (
                <Trans>Creating</Trans>
              ) : (
                <Trans>Create</Trans>
              )}
            </FillButton>
          </Stack>
        </form>
      </Stack>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;
