CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

INSERT INTO users (username, email) VALUES
      ('vishr', 'vishr@gmail.com');

      SELECT * from users;

      INSERT INTO users (username, email)
      VALUES (
          'username:character varying',
          'email@gmail.com'
        );
   