# rgbee
Some dumb fun

## API V1

### auth

#### POST /api/v1/auth/register
Register a new user

Parameters:
- `email` (required): Email address for the user: must be unique
- `username` (required): Username for the user: 1-20 characters, must match regex `[a-zA-Z_][a-zA-Z0-9_]*$`, must be unique
- `password` (required): Password for the user
- `about` (optional): Text description for the user, must be fewer than 400 characters

Returns:
- `200`
- `400` (validation failed)
#### POST /api/v1/auth/login

Login a user. Sets the `rgbee.sess` and `rgbee.sess.sig` cookies to authenticate follow up requests.

Parameters:

- `username` (required): Username of the user
- `password` (required): Password of the user

Returns:

- `200`
- `401`

#### POST /api/v1/auth/logout

Logs out a user. Requires authentication.

Returns:

- `200`

### users

#### GET /api/v1/users/me

Gets the current user. Requires authentication.

Returns:
- `200`

```json
{
  "username": "areebk",
  "email": "areebk@protonmail.com",
  "about": null,
  "createdAt": "2020-05-24T16:15:19.699Z"
}
```

#### GET /api/v1/users/:username

Gets another user's profile. Doesn't include `email` field for privacy.

Returns:

- `200`

```json
{
  "username": "areebk",
  "about": null,
  "createdAt": "2020-05-24T16:15:19.699Z"
}
```

#### GET /api/v1/users/:username/savedStories

#### GET /api/v1/users/:username/savedComments

### stories

#### GET /api/v1/stories/

Gets a list of stories ordered by popularity.

#### POST /api/v1/stories/

Creates a new story, its top level container comment thread, and an automatic upvote from the author to the story. Requires authentication.

Parameters:

- `title` (required): Title for the post: must be 5-100 characters long
- `url`: URL pointer: must be a valid link and <= 2000 characters long, and is mutually exclusive with `body`.
- `body`: Text body for the post: must be at least 4000 characters long, and is mutually exclusive with `url`.

Returns:

- `200` (for link)

```
{
  "title": "test link story 1",
  "url": "http://go.co",
  "thread": {
    "authorId": 1,
    "storyId": 1,
    "id": 1
  },
  "authorId": 1,
  "id": 1
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

| Column      | Type    | Notes                                                        |
| ----------- | ------- | ------------------------------------------------------------ |
| id          | INTEGER | Primary key, not null, generated always as identity, not exposed to clients |
| email       | TEXT    | Unique, not null, checks to make sure length <= 254          |
| username    | TEXT    | Unique, not null, checks to make sure length <= 20           |
| password    | TEXT    | Not null, contains argon 2i hash of password                 |
| about       | TEXT    | Checks to make sure length <= 400                            |
| is_verified | BOOLEAN | Not null, defaults to false                                  |

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
