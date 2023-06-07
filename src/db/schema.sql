DROP TABLE IF EXISTS colours;
CREATE TABLE colours (
  hex_code char(6) PRIMARY KEY,
  name text NOT NULL
);
INSERT INTO colours (
  hex_code, name
) VALUES
  ('#123123', 'albertus'),
  ('#456456', 'chipmunk'),
  ('#818721', 'dorky yellow'),
  ('#80192a', 'stummy brown');
