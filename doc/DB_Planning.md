# LibreCandy

#### Legend

Attribute, *Foreign Key*, **Primary Key**

## Database schema

### User

- Real Name
- **Nickname**
- Avatar
- Email
- Password
- Bio

### Treat

- **Id**
- Description
- Version Tag
- is_Deprecated
- File
- Screenshots {}
- Pub_Datetime

### Comment

- **Id**
- *Author*
- *Treat*
- Content
- Pub_Datetime

### Rating

- **Id**
- *Treat*
- Value (X/10)
- *Author*
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
