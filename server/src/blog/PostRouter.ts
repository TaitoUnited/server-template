import { Context } from 'koa';
import { Joi } from 'koa-joi-router';
import { Service } from 'typedi';
import { Pagination, Order, OrderDirection } from '../common/schema/search';
import BaseRouter from '../common/setup/BaseRouter';
import { ItemSchema } from '../common/schema/rest';
import { PostService } from './PostService';

const BasePostSchema = Joi.object({
  subject: Joi.string().required(),
  content: Joi.string().required(),
  author: Joi.string().required(),
});

const PostSchema = ItemSchema.concat(BasePostSchema);

/**
 * REST API router for Posts
 */
@Service()
export class PostRouter extends BaseRouter {
  constructor(private postService: PostService, router: any = null) {
    super(router);
    this.group = 'Posts';
    this.prefix = '/posts';
    this.setupRoutes();
  }

  private setupRoutes() {
    this.route({
      method: 'get',
      path: '/',
      documentation: {
        description: 'Search posts',
      },
      validate: {
        output: {
          '200': {
            body: this.Joi.object({
              data: this.Joi.array().items(PostSchema).required(),
              total: this.Joi.number().required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        const data = await this.postService.search(
          ctx.state,
          // TODO: search, filters, order, pagination
          '',
          [],
          new Order(OrderDirection.DESC, 'createdAt'),
          new Pagination(0, 50)
        );

        ctx.response.body = {
          total: data.total,
          data: data.data,
        };
      },
    });

    this.route({
      method: 'post',
      path: '/',
      documentation: {
        description: 'Create a post',
      },
      validate: {
        type: 'json',
        body: this.Joi.object({
          data: BasePostSchema.required(),
        }),
        output: {
          '201': {
            body: this.Joi.object({
              data: PostSchema.required(),
            }),
          },
        },
      },
      handler: async (ctx: Context) => {
        const data = await this.postService.create(
          ctx.state,
          ctx.request.body.data
        );

        ctx.response.status = 201;
        ctx.response.body = {
          data,
        };
      },
    });
  }
}
