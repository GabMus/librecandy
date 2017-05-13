# LibreCandy

## Documentation

- [restful authentication with username and password](http://stackoverflow.com/questions/14572600/passport-js-restful-auth)
- [api keys and secret keys](http://stackoverflow.com/questions/2674445/how-do-api-keys-and-secret-keys-work)
- [material components](https://material.io/components/)

#### Legend

Attribute, *Foreign Key*, **Primary Key**, /logic calculated field/

## Database schema

### User

- Realname
- **Username**
- Avatar
- Email
- Password
- Bio
- Signup_Datetime

### Treat

- **Id**
- Name
- Category
- *Author*
- First_Pub_Datetime
- /Last_Pub_Datetime/
- Details [{...},...]
  - **Id**
  - Description
  - Version
  - Is_Deprecated
  - File
  - Screenshots []
  - Pub_Datetime
  - Downloads
- Ratings [{...},...]
  - *Author*
  - Pub_Datetime
  - Value /10
- /Rating_Score/
- Comments [{...},...]
  - **Id**
  - *Author*
  - Content
  - Pub_Datetime

***

# DBMS comparison

## MongoDB

### Pros

- JSON
- Array and Nested Objects
- Easy
- Sharding
- Horizontal/Vertical Scalability

### Cons

- Higher DB Size
- Slow Joins
