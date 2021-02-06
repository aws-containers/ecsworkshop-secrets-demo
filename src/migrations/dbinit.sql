CREATE TABLE todos
(
    id integer NOT NULL,
    title text  NOT NULL,
    description text NOT NULL,
    "isFinished" boolean NOT NULL,
    CONSTRAINT todos_pkey PRIMARY KEY (id)
)
INSERT INTO todos VALUES
(
    1,'Do something','Do Something good',true

)