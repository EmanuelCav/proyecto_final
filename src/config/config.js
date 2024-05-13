import dotenv from 'dotenv';
dotenv.config();

export const port = process.env.PORT
export const mongo_db = process.env.MONGO_DB
export const github_client_id = process.env.GITHUB_CLIENT_ID
export const github_client_secret = process.env.GITHUB_CLIENT_SECRET
export const jwt_key = process.env.JWT_KEY
export const jwt_email_key = process.env.JWT_EMAIL_KEY
export const cookie_key = process.env.COOKIE_KEY
export const my_host = process.env.MY_HOST
export const my_pass = process.env.MY_PASS
export const my_mail = process.env.MY_MAIL

export const cloud_name = process.env.CLOUD_NAME
export const api_key = process.env.API_KEY
export const api_secret = process.env.API_SECRET