# API Planning

[**Reference doc1**](https://blog.mwaysolutions.com/2014/06/05/10-best-practices-for-better-restful-api/)

*Note1: we're aiming to design this API with simplicity in mind. The goal is to make every bit of information easy to access yet easy to implement and maintain.*

**Note2: the standard we're following requires the use of all plural nouns.**

**Note3: upon user deletion, prompt if they just want to temporarily suspend their account instead of deleting everything forever. Also ask if they want to keep the treats they published accessible**

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

`BASE_URI` + `requestname` + `?option1=value1&option2=value2`

| Name | Description | Method | POST attributes |
|----|----|----|----|
| /users | List of users ordered by username | GET |  |
| /users?create | Create new user | POST | realname, username (unique, required), email (unique, required), password (hash?, required), bio |
| /users?orderby=*attribute[+,-]* | List of users ordered by *attribute* ascending (using +) or descending (using -). If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in users schema". **Allowed ordering values: username, (email?), signup_datetime** | GET |  |
| /users?*attribute[=,>,>=<,<=]value* | List of users filtered by *attribute*. If no results for select filter return `"users": []`. If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in users schema". **Allowed filtering values: username, email, signup_datetime, realname**. For strings >,>=,<,<= return "400: Invalid operator *operator*. Use = as contains for string filtering and == as is for usernames". For strings filtering use the = operator with the **contains** semantic and the == operator with the **is** semantic for usernames | GET |  |
| /users?username==*username*&edituser | Edit user | POST | realname, email (unique), password, bio, avatar |
| /users?username==*username*&deleteuser | Delete user and related content in cascade | DELETE |  |
| /treats | List of treats ordered by first_pub_datetime | GET |  |
| /treats?create | Create new treat | POST | name (required), category (fixed set, required), version (required), author (required), description (required), file (required), screenshots (comma separated list of urls, required) |
| /treat?nocomments | Treat request without the comments list | GET |  |
| /treats?id=*treatid*&newversion | Add version to treat | POST | version (unique, required), description (provide old one in the frontend form), deprecation_list (list of newly deprecated versions, required, can provide empty list []), file (required), screenshots (conditionally optional, see next opt), keep_screenshots (required, default=false, indicates that screenshots correspond with the older version) |
| /treats?id=*treatid*&ratetreat | Add or update rating for treat | POST | author (required), value (required) |
| /treats?id=*treatid*&edittreat | Edit general treat info | POST | name (required),  deprecation_list (list of newly deprecated versions, required, can provide empty list []) |
| /treats?id=*treatid*&versionid=*versionid*&editversion | Edit version | POST | version (unique, required), description (required), isdeprecated (required), file (optional, will keep old one if not provided), screenshots (defaults to old list, changes will be overwritten, including removing screenshots from the list) |
| /treats?id=*treatid*&comment | Add comment for treat | POST | author (required), content (required) |
| /treats?id=*treatid*&commentid=*commentid*&deletecomment | Delete comment | DELETE |  |
| /treats?orderby=*attribute[+,-]* | List of treats ordered by *attribute* ascending (using +) or descending (using -). If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in treats schema". **Allowed ordering values: first_pub_datetime, id, name, last_pub_datetime** | GET |  |
| /treats?*attribute[=,>,>=<,<=]value* | List of treats filtered by *attribute*. If no results for select filter return `"treats": []`. If attribute doesn't exist return "400: Invalid operation: no *attribute* attribute in treats schema". **Allowed filtering values: id, name, category, author, first_pub_datetime, last_pub_datetime, rating_score**. For strings >,>=,<,<= return "400: Invalid operator *operator*. Use = as contains for string filtering". For strings filtering only the = operator is used with the **contains** semantic | GET |  |

### Common options

- **offset**: starting index value of the query (**default=0**)
- **limit**: number of elements to get in the query (**default=20**)
