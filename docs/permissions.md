# Permissions

| Permission name   | Description                                                                                                              | Given by default |
| :---------------- | :----------------------------------------------------------------------------------------------------------------------- | :--------------- |
| `login`           | Determines if a user can be log in or is blocked. If this permission is not given, the user is blocked from all actions. | Yes.             |
| `superuser`       | If given, grants the user all permissions                                                                                | No.              |
| `repositoryAdmin` | If given, the user can access all repositories and modify them.                                                          | No.              |
| `upload`          | If given, the user is allowed to upload files.                                                                           | Yes.             |
| `userAdmin`       | If given, the user can modify other users.                                                                               |

```javascript
let test: String = 'hello';
console.log(test);
```
