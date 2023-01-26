import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import { Config } from '../models/config';

export const openapiMiddlewares = ({ server, isDevelopment, packageVersion }: Config) => {
  const options: swaggerJSDoc.Options = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Sedaya',
        version: packageVersion,
      },
      servers: [{ url: `/api/v${server.apiVersion}` }],
    },
    apis: [
      ...(isDevelopment
        ? ['./src/routes/*.ts', './src/openapi/*.yaml']
        : ['./dist/routes/*.js', './dist/openapi/*.yaml']),
    ],
  };
  const specs = swaggerJSDoc(options);
  return [swaggerUI.serve, swaggerUI.setup(specs)];
};
