import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withTheme } from '@material-ui/core/styles';
import { Button, TextField } from '@material-ui/core';

const propTypes = {
  post: PropTypes.any.isRequired,
  onChangePost: PropTypes.func.isRequired,
  onCreatePost: PropTypes.func.isRequired
};

const PostForm = ({ post, onChangePost, onCreatePost }) => {
  return (
    <StyledForm noValidate autoComplete='off'>
      <StyledTextField
        id='subject'
        label='Subject'
        value={post.subject}
        onChange={e => onChangePost({ subject: e.target.value })}
        margin='normal'
      />
      <StyledTextField
        id='content'
        label='Content'
        value={post.content}
        onChange={e => onChangePost({ content: e.target.value })}
        margin='normal'
      />
      <StyledButton variant='outlined' color='primary' onClick={onCreatePost}>
        Add
      </StyledButton>
    </StyledForm>
  );
};

const StyledForm = withTheme()(styled.form`
  && {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: ${props => props.theme.spacing.unit * 4}px;
  }
`);

const StyledTextField = withTheme()(styled(TextField)`
  && {
    margin-right: ${props => props.theme.spacing.unit * 2}px;
    width: 200px;
    @media (max-width: 480px) {
      width: 100%;
      marginright: 0;
    }
  }
`);

const StyledButton = withTheme()(styled(Button)`
  && {
    margin: ${props => props.theme.spacing.unit}px;
    margin-left: 0;
    margin-top: ${props => props.theme.spacing.unit * 3}px;
  }
`);

PostForm.propTypes = propTypes;

export default PostForm;
