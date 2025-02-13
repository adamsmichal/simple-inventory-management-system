import { Joi } from 'celebrate';

export interface AppConfig {
  PORT: string;
}

const schema = Joi.object<AppConfig>()
  .keys({
    PORT: Joi.string().required().default('1337'),
  })
  .unknown();

export const appConfigFactory = (env: NodeJS.ProcessEnv): AppConfig => {
  const { error, value } = schema.validate(env);

  if (error) {
    throw error;
  }

  return value;
};
