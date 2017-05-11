# API Planning

[**Reference doc1**](https://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/)

*Note1: we're aiming to design this API with simplicity in mind. The goal is to make every bit of information easy to access yet easy to implement and maintain.*

**Note2: the standard we're following requires the use of all plural nouns.**

## BASE_URI

`https://librecandy.org/api/v1/`

## Useful HTTP responses

- 200 – OK – Eyerything working
- 201 – OK – New resource created
- 204 – OK – Resource deleted
- 304 – **Not Modified – The client can use cached data**
- 400 – Bad Request – The request was invalid or cannot be served. The exact error should be explained in the error payload. E.g. "The JSON is not valid"
- 401 – Unauthorized – The request requires an user authentication
- 403 – Forbidden – The server understood the request, but is refusing it or the access is not allowed.
- 404 – Not found – There is no resource behind the URI.
- 422 – Unprocessable Entity – Should be used if the server cannot process the enitity, e.g. if an image cannot be formatted or mandatory fields are missing in the payload.

## Query request

*Any request is preceeded by the BASE_URI*


*Options can be added to the request with the following syntax:*

`BASE_URI` + `requestname` + `?option1=value1,value2&option2=value3,value4`

| Name | GET | POST (create) | PUT (update) |
|----|----|----|----|
| /users | List of users ordered by username |  |  |
| /users?orderby=*attribute[+,-]* | List of users ordered by *attribute* ascending (using +) or descending (using -). If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in users schema". **Allowed ordering values: username, (email?), signup_datetime** | 400: Invalid operation (POST) for query /users?orderby | 400: Invalid operation (PUT) for query /users?orderby |
| /users?*attribute[=,>,>=<,<=]value* | List of users filtered by *attribute*. If no results for select filter return `"users": []`. If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in users schema". **Allowed filtering values: username, email, signup_datetime, realname**. For strings >,>=,<,<= return "400: Invalid operator *operator*. Use = as contains for string filtering". For strings filtering only the = operator is used with the **contains** semantic |  |  |
| /treats | List of treats ordered by first_pub_datetime |  |  |
| /treats?orderby=*attribute[+,-]* | List of treats ordered by *attribute* ascending (using +) or descending (using -). If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in treats schema". **Allowed ordering values: first_pub_datetime, id, name, last_pub_datetime** | 400: Invalid operation (POST) for query /treats?orderby | 400: Invalid operation (PUT) for query /treats?orderby |
| /treats?*attribute[=,>,>=<,<=]value* | List of treats filtered by *attribute*. If no results for select filter return `"treats": []`. If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in treats schema". **Allowed filtering values: id, name, category, author, first_pub_datetime, last_pub_datetime, rating**. For strings >,>=,<,<= return "400: Invalid operator *operator*. Use = as contains for string filtering". For strings filtering only the = operator is used with the **contains** semantic |  |  |

### Common options

- **offset**: starting index value of the query (**default=0**)
- **limit**: number of elements to get in the query (**default=20**)
