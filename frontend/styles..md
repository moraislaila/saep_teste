@font-face { font-family: 'Roboto'; font-weight: 400; src: url('/fonts/roboto/Roboto-Regular.ttf'); }
@font-face { font-family: 'Roboto'; font-weight: 500; src: url('/fonts/roboto/Roboto-Medium.ttf'); }
@font-face { font-family: 'Roboto'; font-weight: 700; src: url('/fonts/roboto/Roboto-Bold.ttf'); }

* { box-sizing: border-box; margin: 0; padding: 0; }

/* sem isso o atributo hidden perde para os display das classes */
[hidden] { display: none !important; }

body {
    font-family: Inter, Roboto, sans-serif;
    background: #f2f2f2;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* botões */
.btn {
    background: #222;
    color: #fff;
    border: 1px solid #222;
    border-radius: 20px;
    padding: 8px 18px;
    font: inherit;
    cursor: pointer;
}
.btn:disabled, .btn.desativado { opacity: .4; }
.btn:disabled { cursor: not-allowed; }
.btn-contorno { background: none; color: #222; }
.btn-icone { background: none; border: none; cursor: pointer; }
.btn-icone img { width: 22px; height: 22px; display: block; }

/* cabeçalho */
header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 14px 32px;
    background: #fff;
    border-radius: 0 0 20px 20px;
}
.usuario { display: flex; align-items: center; gap: 12px; }
.usuario img { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; }
.usuario-info { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
.usuario-info .btn { padding: 4px 14px; font-size: 13px; }
h1 { font-size: 28px; text-align: center; }
#btnLogin { justify-self: end; }

/* corpo */
main { flex: 1; width: 100%; max-width: 1000px; margin: 0 auto; padding: 28px 16px; }

#areaBusca { margin-bottom: 24px; text-align: center; }
.busca { position: relative; max-width: 520px; margin: 0 auto 6px; }
.busca input { width: 100%; padding: 11px 44px 11px 16px; border: 1px solid #999; border-radius: 24px; font: inherit; }
.busca img { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; }

/* galeria (3 colunas) */
#galeria { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { background: #fff; border-radius: 14px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, .12); }
.capa { position: relative; }
.capa img { display: block; width: 100%; aspect-ratio: 3 / 4; object-fit: cover; }

/* mini tela no meio da capa, aparece ao passar o mouse */
.dica {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 85%;
    padding: 12px;
    background: rgba(0, 0, 0, .8);
    color: #fff;
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
    border-radius: 10px;
    opacity: 0;
    pointer-events: none;
}
.capa:hover .dica { opacity: 1; }

.card-baixo { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; font-weight: 500; }
.curtir { display: flex; align-items: center; gap: 4px; background: none; border: none; font: inherit; cursor: pointer; }

/* coração e lixeira usam o svg como máscara para poder trocar a cor */
.coracao, .lixeira {
    display: inline-block;
    width: 24px;
    height: 24px;
    background: #000;
    -webkit-mask: url('/icons/coracao.svg') center / contain no-repeat;
    mask: url('/icons/coracao.svg') center / contain no-repeat;
}
.coracao.curtido { background: #f00; }
.lixeira {
    background: #f00;
    border: none;
    cursor: pointer;
    -webkit-mask-image: url('/icons/lixeira.svg');
    mask-image: url('/icons/lixeira.svg');
}

.vazio { grid-column: 1 / -1; text-align: center; color: #666; }
.erro { color: #f00; font-size: 13px; }

/* cadastro de filmes */
#cadastro {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 480px;
    margin: 0 auto 32px;
}
#cadastro .btn-contorno { align-self: flex-start; }
#cadastro label, .rotulo { font-weight: 500; margin-top: 8px; }
#cadastro input[id] { padding: 10px 14px; border: 1px solid #000; border-radius: 12px; font: inherit; }
#cadastro .arquivo label { margin: 0; font-weight: 400; cursor: pointer; }
#cadastro #btnCadastrar { align-self: flex-start; margin-top: 12px; }
.arquivo { display: flex; align-items: center; gap: 12px; }

/* menu lateral */
#menu {
    position: fixed;
    top: 0; left: 0;
    width: 280px;
    height: 100%;
    padding: 24px;
    background: #fff;
    border-radius: 0 20px 20px 0;
    box-shadow: 2px 0 12px rgba(0, 0, 0, .3);
    display: flex;
    flex-direction: column;
    gap: 14px;
    z-index: 10;
}
#menu .btn-icone { align-self: flex-end; }
.menu-foto { width: 96px; height: 96px; border-radius: 50%; object-fit: cover; align-self: center; }
#menu h3, #menu p { text-align: center; }
.btn-borda { width: 100%; background: none; border: 2px solid #000; border-radius: 14px; padding: 12px; font: inherit; font-weight: 500; cursor: pointer; }

/* rodapé */
footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 16px 32px;
    background: #222;
    color: #fff;
    border-radius: 20px 20px 0 0;
}
.redes { display: flex; gap: 18px; }
.redes img { width: 24px; height: 24px; filter: invert(1); } /* svg preto vira branco */
.copyright { text-align: right; }

/* modal de login */
dialog { margin: auto; width: min(400px, 90vw); padding: 24px; border: none; border-radius: 16px; }
dialog[open] { display: flex; flex-direction: column; gap: 8px; }
dialog::backdrop { background: rgba(0, 0, 0, .6); }
dialog input { padding: 10px 14px; border: 1px solid #999; border-radius: 10px; font: inherit; }
.modal-topo { position: relative; text-align: center; margin-bottom: 8px; }
.modal-topo .btn-icone { position: absolute; right: 0; top: 0; }
.botoes { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }