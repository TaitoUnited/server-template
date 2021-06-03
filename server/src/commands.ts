import 'reflect-metadata';
import { Container } from 'typedi';
import getDb from './common/db';
import { PostDao } from './blog/PostDao';
import { CreatePostInput } from '../shared/types/blog';

// CLI commands for cronjobs, etc.

const createPost = async (
  subject?: string,
  author?: string,
  content?: string
) => {
  const db = await getDb();
  const postDao = Container.get(PostDao);

  const post: CreatePostInput = {
    subject: subject || 'example subject',
    author: author || 'example author,',
    content: content || 'example content',
  };
  postDao.createPost(db, post);
  console.log('New post created.');
};

export const commands = {
  createPost,
};

const main = () => {
  const command = process.argv[2];
  // @ts-ignore
  const func = commands[command];
  if (!func) {
    console.error(`ERROR: Unknown command '${command}'.`);
    process.exit(1);
  }
  func(...process.argv.slice(3));
};

if (require.main === module) {
  main();
}