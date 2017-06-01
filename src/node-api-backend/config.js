var config = {
    secret: 'notsosecretsecret',
    database: 'localhost:27017',
    media_storage: 'DefaultEndpointsProtocol=https;AccountName=librecandystorage;AccountKey=fLsRGnUnsteIRD1ZJ+BpLtXjKF6QnMROtbCbSAuvW+TV/im0DlmSEWHtsweQu7vFC94V7mhL9x0s6UEzsNntqw==;EndpointSuffix=core.windows.net',
    jwt_refresh_time: 3600000, // 1 hour
    media_upload: '/tmp/librecandy/uploads/',
    media_path: 'users',
    share_name: 'librecandyshare',
    //media_path: __dirname+'/media/',
    avatart_size: '420',
    screenshot_size: '1920',
    treat_mimetypes: [
        'application/zip',
        'application/x-xz',
        'application/x-7z-compressed',
        'application/x-bzip2',
        'application/x-gzip'
    ],
    treat_categories: [
        'Icons',
        'GTK',
        'Qt',
        'Wallpapers'
    ]
};

module.exports = config;
