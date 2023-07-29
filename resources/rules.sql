create table if not exists cr_txt
(
    cr_id      INTEGER
        primary key autoincrement,
    set_code   NCHAR(3)                           not null
        unique,
    time_added DATETIME default (datetime('now')) not null,
    rules_text TEXT                               not null
);

create table if not exists cr_contents
(
    cr_id         integer
        constraint cr_contents_pk
            primary key
        constraint cr_contents_cr_txt_cr_id_fk
            references cr_txt,
    contents_json TEXT not null
);

create table if not exists cr_json
(
    cr_id NCHAR(3) not null
        constraint cr_json_pk
            primary key
        constraint cr_json_cr_txt_cr_id_fk
            references cr_txt,
    json  TEXT     not null
);