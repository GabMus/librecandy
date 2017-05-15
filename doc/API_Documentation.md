# API DOCUMENTATION
## BASE URI : /api/v1/
## User
### /authenticate

#### Post

##### Parameters:

user.username

### /superuser

#### Post

##### Parameters

username
email
password
realname
bio

### /users

#### Post

##### Parameters

username
email
password
realname
password
bio

#### Get

##### Parameters

offset
limit

### /users/:username

#### Get

##### Parameters

username

#### Put

##### Parameters

username
realname
bio
password

#### Delete

##### Parameters

username

### /user/:username/avatar

#### Post

##### Parameters

username
file

#### Delete

##### Parameters

username

### /user/:username/treats

#### Get

##### Parameters

username
offset
limit

## Treat
### /treats

#### Get

##### Parameters

offset
limit

#### Post

##### Parameters

name
username
category

### /treats/:treatid

#### Get

##### Parameters

treatid

#### Delete

##### Parameters

username
treatid

### /treats/:pkgname

#### Get

##### Parameters

pkgname

#### Delete

##### Parameters

username
pkgname
