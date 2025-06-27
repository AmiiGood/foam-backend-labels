ALTER TABLE usuarios ADD COLUMN estado TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = Activo, 0 = Eliminado';
