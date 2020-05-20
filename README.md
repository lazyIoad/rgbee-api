## API V1

### /api/v1/auth/register
Register a new user

Parameters:
- `email`: Email address for the user: max 200 characters, must be unique
- `username`: Username for the user: 1-20 characters must be unique
- `password`: Password for the user

Returns:
- `200`
- `400` (validation failed):
```js
{
  "message": "Validation failed.",
  "type": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "password",
      "messages": [
        "Field is a required property"
      ]
    },
    {
      "field": "email",
      "messages": [
        "Field is a required property"
      ]
    }
  ]
}
```

```js
{
  "message": "Validation failed.",
  "type": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "username",
      "messages": [
        "Field should NOT be longer than 20 characters"
      ]
    }
  ]
}
```

## Tables

### entities
Used as an abstract class for several user-created entities, such as stories and comments.

| Column     | Type        | Notes                             |
| ---------- | ----------- | --------------------------------- |
| created_at | TIMESTAMPTZ | Not null, defaults to insert time |
| updated_at | TIMESTAMPTZ | Not null, defaults to insert time |
| deleted_at | TIMESTAMPTZ | May be null if entity not deleted |
| is_deleted | BOOLEAN     | Not null, defaults to false       |

### users
Stores all users. Inherits fields from entities table.

| Column           | Type    | Notes                                                                       |
| ---------------- | ------- | --------------------------------------------------------------------------- |
| id               | INTEGER | Primary key, not null, generated always as identity, not exposed to clients |
| email            | TEXT    | Unique, not null, checks to make sure length <= 254                         |
| username         | TEXT    | Unique, not null, checks to make sure length <= 20                          |
| password         | TEXT    | Not null, contains argon 2i hash of password                                |
| about            | TEXT    | Checks to make sure length <= 400                                           |

### stories
Stores all posts. Inherits fields from entities and votables tables.

| Column           | Type    | Notes                                                                       |
| ---------------- | ------- | --------------------------------------------------------------------------- |
| id               | INTEGER | Primary key, not null, generated always as identity                         |
| title            | TEXT    | Not null, checks to make sure length <= 100                                 |
| url              | TEXT    | Checks to make sure length <= 2000, existence is mutually exclusive to body |
| body             | TEXT    | Existence is mutually exclusive to url, client validates length <= 4000     |
| author_id        | INTEGER | Not null, references users(id), cascades update & delete                    |

### comments
Stores all comments on posts. Inherits fields from entities and votables tables.

| Column           | Type    | Notes                                                                                                |
| ---------------- | ------- | ---------------------------------------------------------------------------------------------------- |
| id               | INTEGER | Primary key, not null, generated always as identity                                                  |
| body             | TEXT    | Client validates presence if not container thread and length <= 4000                                 |
| author_id        | INTEGER | Not null, references users(id), cascades update & delete                                             |
| story_id         | INTEGER | Not null, references stories(id), cascades update                                                    |
| parent_id        | INTEGER | References comments(id), cascades update, is null only when this is the container thread for a story |

### stories_upvotes
Join through table between users and stories indicating an upvote relationship.

| Column   | Type    | Notes                                                      |
| -------- | ------- | ---------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete   |
| story_id | INTEGER | Not null, references stories(id), cascades update & delete |

### stories_downvotes
Join through table between users and stories indicating a downvote relationship.

| Column   | Type    | Notes                                                      |
| -------- | ------- | ---------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete   |
| story_id | INTEGER | Not null, references stories(id), cascades update & delete |

### stories_saves
Join through table between users and stories indicating a save relationship.

| Column   | Type    | Notes                                                      |
| -------- | ------- | ---------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete   |
| story_id | INTEGER | Not null, references stories(id), cascades update & delete |

### comments_upvotes
Join through table between users and comments indicating an upvote relationship.

| Column   | Type    | Notes                                                       |
| -------- | ------- | ----------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete    |
| story_id | INTEGER | Not null, references comments(id), cascades update & delete |

### comments_downvotes
Join through table between users and comments indicating a downvote relationship.

| Column   | Type    | Notes                                                       |
| -------- | ------- | ----------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete    |
| story_id | INTEGER | Not null, references comments(id), cascades update & delete |

### comments_saves
Join through table between users and comments indicating a save relationship.

| Column   | Type    | Notes                                                       |
| -------- | ------- | ----------------------------------------------------------- |
| user_id  | INTEGER | Not null, references users(id), cascades update & delete    |
| story_id | INTEGER | Not null, references comments(id), cascades update & delete |

## Functions

### recentness -> integer
Returns the number of hours between two timestamps, rounded down.

| Argument     | Type      | Notes                           |
| ------------ | --------- | ------------------------------- |
| entity_stamp | TIMESTAMP | Timestamp of entity creation    |
| sys_stamp    | TIMESTAMP | Timestamp of curent system time |

### popular_ranking -> numeric
Returns the ranking of a votable according to this formula: (score) / (recentness(entity_stamp, sys_stamp) + time_offset) ^ gravity.

| Argument     | Type      | Notes                                                                                                |
| ------------ | --------- | ---------------------------------------------------------------------------------------------------- |
| score        | INTEGER   | Primary key, not null, generated always as identity                                                  |
| entity_stamp | TIMESTAMP |                                                                                                      |
| sys_stamp    | TIMESTAMP | Not null, references users(id), cascades update & delete                                             |
| time_offset  | INTEGER   | Not null, references stories(id), cascades update                                                    |
| gravity      | NUMERIC   | References comments(id), cascades update, is null only when this is the container thread for a story |