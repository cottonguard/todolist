create table if not exists todo
(
    id integer primary key not null,
    user_id integer not null,
    title text,
    done integer not null default (0),
    created_at integer not null default (unixepoch())
);