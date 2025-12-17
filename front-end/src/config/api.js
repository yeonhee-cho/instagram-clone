import axios from "axios";

export const API_BASE_URL = process.env.NODE_ENV === 'production' ?
    'http://database-1-public-insta.cfcgmc6809ia.ap-southeast-2.rds.amazonaws.com' :
    'http://localhost:3000';