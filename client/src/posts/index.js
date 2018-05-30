import React, { Component } from 'react';
import { Typography } from '@material-ui/core';

import Page from '~layout/Page';
import api from '~entities/posts.api';
import PostForm from './PostForm';
import PostList from './PostList';

class PostsContainer extends Component {
  state = {
    post: {
      subject: '',
      content: ''
    },
    posts: []
  };

  componentDidMount() {
    this.fetchPosts();
  }

  onChangePost = post => {
    this.setState({
      post: { ...this.state.post, ...post }
    });
  };

  onCreatePost = async () => {
    const post = await api.create({ post: this.state.post });
    this.setState({
      post: {
        subject: '',
        content: ''
      },
      posts: [post, ...this.state.posts]
    });
  };

  fetchPosts = async () => {
    const { items } = await api.fetch();
    this.setState({ posts: items });
  };

  render() {
    return (
      <Page>
        <Typography variant='title'>Posts</Typography>
        <Typography>
          Demonstrates vanilla React and real-time updates (TODO real-time).
        </Typography>
        <PostForm
          post={this.state.post}
          onChangePost={this.onChangePost}
          onCreatePost={this.onCreatePost}
        />
        <PostList posts={this.state.posts} />
      </Page>
    );
  }
}

export default PostsContainer;
