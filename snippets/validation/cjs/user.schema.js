const { z } = require('zod');

const createUserSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not a valid email'),
  }),
});

module.exports = { createUserSchema };
