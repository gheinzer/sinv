# Errors

## Thrown errors

| Error name                        | Error description                                                                                                 | Thrown by                                                                                  |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `user_identification_not_defined` | There was a `SINVUserSystem.identificationObject` given without defining any of the identification possibilities. | `SINVUserSystem.User.init()`                                                               |
| `user_not_found`                  | The user identified by the `identificationObject` does not exist.                                                 | `SINVUserSystem.User.init()`                                                               |
| `user_already_exists`             | The user you are trying to create already exists.                                                                 | `SINVUserSystem.createUser()`                                                              |
| `object_id_non-existant`          | The object you are tying to get does not exist.                                                                   | `SINVObjects.SINVObject.init()`                                                            |
| `repository_permission_denied`    | The user does not have permission to a repository.                                                                | `SINVRepositories.Repository.userHasPermissionOrThrow()`                                   |
| `type_not_in_this_repository`     | The type with this ID is not in the selected repository.                                                          | `SINVRepositories.Repository.changeTypeName()`, `SINVRepositories.Repository.deleteType()` |

## API errors

| Error name                              | Error description                                                     |
| --------------------------------------- | --------------------------------------------------------------------- |
| `unsufficient_permissions_{permission}` | The authenticated user doesn't have one or more required permissions. |
| `not_authenticated_when_required`       | No session ID was given, but would have be required.                  |
| `required_field_nonexistent_{field}`    | One or more required fields were not given.                           |
| `wrong_password`                        | The password given to authenticate the user was wrong.                |
