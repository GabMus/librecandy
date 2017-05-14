var config = {
    secret: 'notsosecretsecret',
    database: 'mongodb://localhost:27017/node-api-backend',
    jwt_refresh_time: 3600000, // 1 hour
    media_path: './uploads/mediafiles/',
    avatar_rel_path: '/avatar/'
};

config.avatar_path = config.media_path + config.avatar_rel_path;

module.exports = config;
