import authorize from '../common/authorize.util.js';

import dao from './dao';

/**
 * Responsibilities of a service:
 *
 * - Authorizes that the user has a right to execute the operation with the
 *   given parameters.
 * - Validates the given parameters (NOTE: only for such part that is not
 *   handled by schema validation tools like joi or swagger)
 * - Executes the operation with the help of fine-grained DAOs and other
 *   services.
 * - Does not operate on http request and response directly.
 * - Throws an exception in case of an error.
 *
 * NOTE: In a really simple application you may combine router, service and dao
 * into one class in which you parse request, authorize, validate,
 * execute database operation and generate response with a single method.
 */

export default class PostService {
  constructor(postDAO) {
    // Make component testable by using primarily dependencies
    // given as constuctor args.
    this.postDAO = postDAO || dao;
  }

  async fetch(state, criteria) {
    authorize(state).role('admin', 'user');
    return this.postDAO.fetch(state.getTx(), criteria);
  }

  async create(state, post) {
    authorize(state).role('admin', 'user');
    const id = await this.postDAO.create(state.getTx(), post);
    return this.postDAO.read(state.getTx(), id);
  }

  async read(state, id) {
    authorize(state).role('admin', 'user');
    return this.postDAO.read(state.getTx(), id);
  }

  async update(state, post) {
    authorize(state).role('admin');
    await this.postDAO.update(state.getTx(), post);
  }

  async patch(state, post) {
    authorize(state).role('admin');
    await this.postDAO.patch(state.getTx(), post);
  }

  async remove(state, id) {
    authorize(state).role('admin');
    await this.postDAO.remove(state.getTx(), id);
  }
}