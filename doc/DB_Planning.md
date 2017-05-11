# LibreCandy

#### Legend

Attribute, *Foreign Key*, **Primary Key**

## Database schema

### User

- Real Name
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
- Details {...}
 - Description
 - Version
 - Is_Deprecated
 - File
 - Screenshots []
 - Pub_Datetime
- Ratings {...}
 - *Author*
 - Pub_Datetime
 - Value /10
- Comments {...}
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
