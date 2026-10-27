CREATE TABLE tb_usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(100) NOT NULL,
    email VARCHAR(80) NOT NULL,
    senha VARCHAR(100) NOT NULL,
    imagem_usuario VARCHAR(200) NOT NULL,
    tipo VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT uk_usuario_email UNIQUE (email)
);

CREATE TABLE tb_filme (
    id_filme SERIAL PRIMARY KEY,
    titulo_filme VARCHAR(100) NOT NULL,
    genero VARCHAR(80) NOT NULL,
    url_capa VARCHAR(120) NOT NULL,
    id_usuario INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_filme_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE tb_curtida (
    id_curtida SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    id_filme INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT fk_curtida_usuario FOREIGN KEY (id_usuario) REFERENCES tb_usuario (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_curtida_filme FOREIGN KEY (id_filme) REFERENCES tb_filme (id_filme) ON DELETE CASCADE,
    CONSTRAINT uk_usuario_filme_curtida UNIQUE (id_usuario, id_filme)
);
