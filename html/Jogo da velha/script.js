// O algoritmo Minimax avalia recursivamente todas as jogadas possíveis para encontrar o 
// melhor resultado em um jogo. Ele maximiza o ganho para o jogador atual e minimiza o 
// potencial para o oponente, atribuindo pontuações (+1, -1 ou 0) aos estados finais do tabuleiro.
// O processo retorna o valor ideal para cada jogada, garantindo que a IA tome decisões otimizadas,
// mesmo contra oponentes perfeitos.



window.addEventListener("DOMContentLoaded", () => {
    // Seleciona os elementos do DOM
    const tiles = Array.from(document.querySelectorAll('.tile')); // Todas as células do tabuleiro
    const resetButton = document.querySelector('#reset'); // Botão de reset
    const announcer = document.querySelector('.announcer'); // Elemento para exibir o resultado

    // Variáveis de estado do jogo
    let board = ['', '', '', '', '', '', '', '', '']; // Representa o estado atual do tabuleiro
    let currentPlayer = 'X'; // Jogador atual ('X' ou 'O')
    let isGameActive = true; // Flag para determinar se o jogo está ativo

    // Constantes de resultados possíveis
    const PLAYERX_WON = "PLAYERX_WON";
    const PLAYERO_WON = "PLAYERO_WON";
    const TIE = "TIE";

    // Condições de vitória (combinações de células)
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6],           // Diagonais
    ];

    // Verifica se houve vitória ou empate e atualiza o estado do jogo
    function handleResultValidation() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            // Verifica se as células correspondem e não estão vazias
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            // Anuncia o vencedor e encerra o jogo
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        // Caso não haja mais espaços vazios, declara empate
        if (!board.includes('')) {
            announce(TIE);
        }
    }

    // Exibe uma mensagem correspondente ao resultado do jogo
    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Jogador <span class="playerO">O</span> Venceu';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Jogador <span class="playerX">X</span> Venceu';
                break;
            case TIE:
                announcer.innerText = "Empate";
        }
        announcer.classList.remove('hide'); // Mostra a mensagem
    };

    // Alterna entre os jogadores
    const changePlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    };

    // Executa uma jogada do jogador humano
    const userAction = (tile, index) => {
        if (!tile.innerText && isGameActive) { // Verifica se a célula está vazia e o jogo ativo
            board[index] = currentPlayer; // Atualiza o tabuleiro
            tile.innerText = currentPlayer; // Exibe o símbolo do jogador
            handleResultValidation(); // Verifica o estado do jogo
            if (isGameActive) {
                changePlayer(); // Alterna o jogador
                if (currentPlayer === 'O') IAMove(); // A IA joga se for sua vez
            }
        }
    };

    // Adiciona eventos de clique para todas as células do tabuleiro
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    // Reinicia o jogo para o estado inicial
    resetButton.addEventListener('click', () => {
        board = ['', '', '', '', '', '', '', '', '']; // Reseta o tabuleiro
        tiles.forEach(tile => {
            tile.innerText = ''; // Limpa as células
        });
        announcer.classList.add('hide'); // Esconde o resultado
        isGameActive = true; // Reativa o jogo
        currentPlayer = 'X'; // Define o jogador inicial
    });

    // Movimento da IA baseado no algoritmo Minimax
    function IAMove() {
        let bestScore = -Infinity; // Melhor pontuação inicial
        let move;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') { // Verifica células vazias
                board[i] = 'O'; // Simula o movimento
                let score = minimax(board, 0, false); // Calcula a pontuação
                board[i] = ''; // Reverte o movimento
                if (score > bestScore) { // Atualiza a melhor jogada
                    bestScore = score;
                    move = i;
                }
            }
        }
        board[move] = 'O'; // Realiza a melhor jogada
        tiles[move].innerText = 'O';
        handleResultValidation(); // Verifica o estado do jogo
        if (isGameActive) changePlayer(); // Alterna para o próximo jogador
    }

    // Algoritmo Minimax para encontrar a melhor jogada
    function minimax(board, depth, isMaximizing) {
        if (checkWin('O')) return 1; // Vitória da IA
        if (checkWin('X')) return -1; // Vitória do jogador
        if (!board.includes('')) return 0; // Empate

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'O'; // Simula o movimento da IA
                    let score = minimax(board, depth + 1, false); // Recursão
                    board[i] = ''; // Reverte o movimento
                    bestScore = Math.max(score, bestScore); // Calcula o melhor score
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (board[i] === '') {
                    board[i] = 'X'; // Simula o movimento do jogador
                    let score = minimax(board, depth + 1, true); // Recursão
                    board[i] = ''; // Reverte o movimento
                    bestScore = Math.min(score, bestScore); // Calcula o pior score
                }
            }
            return bestScore;
        }
    }

    // Verifica se um jogador venceu
    function checkWin(player) {
        return winningConditions.some(([a, b, c]) => {
            return board[a] === player && board[b] === player && board[c] === player;
        });
    }
});
