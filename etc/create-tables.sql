CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    email character varying(60) NOT NULL UNIQUE,
    username character varying(60) NOT NULL,
    first_name character varying(60),
    last_name character varying(60),
    is_admin boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

CREATE UNIQUE INDEX users_pkey ON users(id int4_ops);
CREATE UNIQUE INDEX users_email_key ON users(email text_ops);

CREATE TABLE recipes
(
    id SERIAL PRIMARY KEY,
    title character varying(120) NOT NULL,
    title_for_url character varying(100) NOT NULL,
    description character varying(500) NOT NULL,
    ingredients character varying(1000) NOT NULL,
    steps character varying(2000) NOT NULL,
    keywords character varying(100),
    active boolean NOT NULL DEFAULT false,
    featured_image_name character varying(50) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    user_id integer REFERENCES users (id)
);
CREATE UNIQUE INDEX recipes_pkey ON recipes(id int4_ops);

CREATE TABLE email_subscription (
    id SERIAL PRIMARY KEY,
    email text NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    subscribed boolean NOT NULL DEFAULT true
);

CREATE UNIQUE INDEX email_subscription_pkey ON email_subscription(id int4_ops);