var config = {
    secret: 'notsosecretsecret',
    database: 'mongodb://localhost:27017/node-api-backend',
    jwt_refresh_time: 3600000, // 1 hour
    media_upload: '/tmp/librecandy/uploads/',
    media_path: __dirname+'/media/',
    avatart_size: '420',
    screenshot_size: '1920',
    treat_mimetypes: [
        'application/zip',
        'application/x-xz',
        'application/x-7z-compressed',
        'application/x-bzip2',
        'application/x-gzip'
    ]
};

module.exports = config;
