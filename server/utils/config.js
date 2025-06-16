import dotenv from 'dotenv';

dotenv.config();

const config = {
  DATABASE:
    'mongodb+srv://jiugwng:<db_password>@eatwhere.zvlwtzh.mongodb.net/eatWhere?retryWrites=true&w=majority&appName=EatWhere',
  DATABASE_PASSWORD: 'UH1CN2ACwSH6GMwZ',
  PORT: 8080,
  JWT_SECRET: 'supersecretkey123',
  JWT_EXPIRES_IN: '90d',
  JWT_COOKIE_EXPIRES_IN: 90,
};

export default config;
