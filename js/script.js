// Biến toàn cục để lưu trữ các phòng chơi và trạng thái game
let rooms = {};
let currentGame = null; // Đối tượng game hiện tại
let currentPlayerId = null; // ID của người chơi hiện tại

const characterList = [
    'Cat', 'Dog', 'Chicken', 'Frog', 'Panda', 'Lion', 'Tiger', 'Monkey', 'Elephant', 'Rabbit', 
    'Fox', 'Bear', 'Wolf', 'Deer', 'Horse', 'Cow', 'Pig', 'Sheep', 'Goat', 'Duck', 
    'Goose', 'Swan', 'Crow', 'Owl', 'Eagle', 'Snake', 'Lizard', 'Turtle', 'Snail', 
    'Bee', 'Ant', 'Spider'
];

const allCharacterDescriptions = {
    'Cat': { skin: 'orange', hair: 'black', eye: 'blue', face: 'round', jewelry: 'yes' },
    'Dog': { skin: 'brown', hair: 'short', eye: 'brown', face: 'square', hat: 'no' },
    'Chicken': { skin: 'white', hair: 'feathers', eye: 'black', face: 'oval', jewelry: 'no' },
    'Frog': { skin: 'green', hair: 'none', eye: 'yellow', face: 'round', glasses: 'no' },
    'Panda': { skin: 'white-black', hair: 'furry', eye: 'black', face: 'round', scarf: 'yes' },
    'Lion': { skin: 'gold', hair: 'mane', eye: 'gold', face: 'long', mustache: 'yes' },
    'Tiger': { skin: 'orange-black', hair: 'striped', eye: 'green', face: 'square', scarf: 'no' },
    'Monkey': { skin: 'brown', hair: 'fur', eye: 'brown', face: 'long', hat: 'yes' },
    'Elephant': { skin: 'gray', hair: 'short', eye: 'black', face: 'long', trunk: 'yes' },
    'Rabbit': { skin: 'white', hair: 'fur', eye: 'red', face: 'oval', ears: 'long' },
    'Fox': { skin: 'red', hair: 'fur', eye: 'brown', face: 'pointy', tail: 'bushy' },
    'Bear': { skin: 'brown', hair: 'fur', eye: 'black', face: 'round', glasses: 'yes' },
    'Wolf': { skin: 'gray', hair: 'fur', eye: 'yellow', face: 'long', teeth: 'sharp' },
    'Deer': { skin: 'brown', hair: 'fur', eye: 'brown', face: 'long', antlers: 'yes' },
    'Horse': { skin: 'brown', hair: 'mane', eye: 'brown', face: 'long', necklace: 'yes' },
    'Cow': { skin: 'black-white', hair: 'fur', eye: 'black', face: 'oval', spots: 'yes' },
    'Pig': { skin: 'pink', hair: 'bristles', eye: 'black', face: 'round', snout: 'yes' },
    'Sheep': { skin: 'white', hair: 'wool', eye: 'black', face: 'oval', wool: 'thick' },
    'Goat': { skin: 'white', hair: 'beard', eye: 'yellow', face: 'long', horns: 'yes' },
    'Duck': { skin: 'white', hair: 'feathers', eye: 'black', face: 'oval', beak: 'yes' },
    'Goose': { skin: 'white', hair: 'feathers', eye: 'blue', face: 'oval', neck: 'long' },
    'Swan': { skin: 'white', hair: 'feathers', eye: 'black', face: 'long', neck: 'very long' },
    'Crow': { skin: 'black', hair: 'feathers', eye: 'black', face: 'oval', wings: 'yes' },
    'Owl': { skin: 'brown', hair: 'feathers', eye: 'yellow', face: 'round', glasses: 'yes' },
    'Eagle': { skin: 'brown', hair: 'feathers', eye: 'yellow', face: 'pointy', beak: 'curved' },
    'Snake': { skin: 'green-black', hair: 'scales', eye: 'red', face: 'long', tongue: 'forked' },
    'Lizard': { skin: 'green', hair: 'scales', eye: 'yellow', face: 'long', tail: 'yes' },
    'Turtle': { skin: 'green', hair: 'shell', eye: 'black', face: 'round', shell: 'yes' },
    'Snail': { skin: 'brown', hair: 'shell', eye: 'black', face: 'round', shell: 'spiral' },
    'Bee': { skin: 'yellow-black', hair: 'fur', eye: 'black', face: 'round', wings: 'yes' },
    'Ant': { skin: 'black', hair: 'none', eye: 'black', face: 'oval', antennae: 'yes' },
    'Spider': { skin: 'black', hair: 'hairy', eye: 'black', face: 'round', legs: 'eight' }
};

const nightTime = 45;
const dayTime = 45;
const discussionTime = 60;
const voteTime = 10;
let timer;

// Hàm hiển thị màn hình
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

// Khởi tạo các sự kiện
document.getElementById('join-room-btn').addEventListener('click', () => {
    showScreen('join-room-screen');
    updateRoomList();
});

document.getElementById('create-room-btn').addEventListener('click', () => {
    showScreen('create-room-screen');
});

document.getElementById('back-to-welcome-btn').addEventListener('click', () => {
    showScreen('welcome-screen');
});

document.getElementById('back-to-welcome-btn-2').addEventListener('click', () => {
    showScreen('welcome-screen');
});

document.getElementById('create-btn').addEventListener('click', () => {
    const roomName = document.getElementById('room-name-input').value;
    const playerCount = parseInt(document.getElementById('player-count-input').value);
    
    if (roomName && playerCount >= 4 && playerCount <= 16) {
        const roomId = 'room-' + Date.now();
        rooms[roomId] = {
            id: roomId,
            name: roomName,
            maxPlayers: playerCount,
            players: [],
            status: 'waiting'
        };
        alert(`Phòng "${roomName}" đã được tạo!`);
        showScreen('welcome-screen');
    } else {
        alert('Vui lòng nhập tên phòng và số người chơi hợp lệ (4-16).');
    }
});

// Cập nhật danh sách phòng
function updateRoomList() {
    const roomListElement = document.getElementById('room-list');
    roomListElement.innerHTML = '';
    for (const roomId in rooms) {
        const room = rooms[roomId];
        if (room.players.length < room.maxPlayers) {
            const li = document.createElement('li');
            li.className = 'room-item';
            li.innerHTML = `
                <span>${room.name} (${room.players.length}/${room.maxPlayers})</span>
                <button class="join-room-btn" onclick="joinRoom('${roomId}')">Tham gia</button>
            `;
            roomListElement.appendChild(li);
        }
    }
}

// Tham gia phòng
function joinRoom(roomId) {
    const room = rooms[roomId];
    if (!room) return;

    if (room.players.length >= room.maxPlayers) {
        alert('Phòng đã đầy.');
        return;
    }

    // Tạo người chơi mới (ID tạm thời)
    const newPlayerId = 'player-' + Date.now();
    currentPlayerId = newPlayerId;
    room.players.push({ id: newPlayerId, name: 'Player', character: null, role: null, score: 0 });

    // Chuyển sang màn hình chọn nhân vật
    showScreen('game-screen');
    document.getElementById('game-status').innerText = 'Chờ người chơi khác...';
    document.getElementById('player-character-selection').classList.remove('hidden');

    renderCharacterSelection(room.players);
}

let selectedCharacter = null;
function renderCharacterSelection(playersInRoom) {
    const characterSelectionGrid = document.getElementById('character-selection-grid');
    characterSelectionGrid.innerHTML = '';
    const usedCharacters = playersInRoom.map(p => p.character).filter(c => c !== null);

    characterList.forEach(charName => {
        const charCard = document.createElement('div');
        charCard.className = 'character-card';
        if (usedCharacters.includes(charName)) {
            charCard.classList.add('disabled');
        } else {
            charCard.onclick = () => {
                // Xóa lựa chọn cũ
                document.querySelectorAll('.character-card').forEach(card => card.classList.remove('selected'));
                // Chọn nhân vật mới
                charCard.classList.add('selected');
                selectedCharacter = charName;
            };
        }
        charCard.innerHTML = `<span class="character-name">${charName}</span>`;
        characterSelectionGrid.appendChild(charCard);
    });
}

document.getElementById('confirm-character-btn').addEventListener('click', () => {
    if (!selectedCharacter) {
        alert('Vui lòng chọn một nhân vật!');
        return;
    }

    // Cập nhật tên và nhân vật cho người chơi hiện tại
    const room = Object.values(rooms).find(r => r.players.some(p => p.id === currentPlayerId));
    const player = room.players.find(p => p.id === currentPlayerId);
    if (player) {
        player.name = selectedCharacter;
        player.character = selectedCharacter;
    }

    document.getElementById('player-character-selection').classList.add('hidden');
    document.getElementById('game-status').innerText = 'Đã chọn nhân vật. Chờ người chơi khác...';

    // Bắt đầu game khi đủ người
    if (room.players.length === room.maxPlayers) {
        startGame(room);
    }
});

// Bắt đầu trò chơi
function startGame(room) {
    currentGame = { ...room, round: 1 };
    
    document.getElementById('player-character-selection').classList.add('hidden');
    document.getElementById('character-list').classList.remove('hidden');
    document.getElementById('chat-box').classList.remove('hidden');
    document.getElementById('game-status').innerText = 'Trò chơi bắt đầu!';

    startNewRound();
}

function startNewRound() {
    if (currentGame.round > 10) {
        endGame();
        return;
    }

    // Phân vai trò ngẫu nhiên cho người chơi
    assignRoles(currentGame.players, currentGame.maxPlayers);

    // Giai đoạn ban đêm
    updateUIForNight();
    startTimer(nightTime, handleNightActions);
}

function assignRoles(players, playerCount) {
    let rolesConfig;
    if (playerCount >= 4 && playerCount <= 6) {
        rolesConfig = { 'Kẻ phá hoại': 1, 'Thường dân': playerCount - 1 };
    } else if (playerCount >= 8 && playerCount <= 10) {
        rolesConfig = { 'Kẻ phá hoại': 1, 'Thám tử': 1, 'Bảo vệ': 1, 'Thường dân': playerCount - 3 };
    } else if (playerCount >= 11 && playerCount <= 16) {
        rolesConfig = { 'Kẻ phá hoại': 1, 'Thám tử': 1, 'Bảo vệ': 1, 'Pháp y': 1, 'Gã hề': 1, 'Thường dân': playerCount - 5 };
    }

    const availableRoles = Object.entries(rolesConfig)
        .flatMap(([role, count]) => Array(count).fill(role));
    
    // Xáo trộn mảng vai trò
    availableRoles.sort(() => Math.random() - 0.5);

    players.forEach((player, index) => {
        player.role = availableRoles[index];
    });
}

function updateUIForNight() {
    document.getElementById('round-number').innerText = currentGame.round;
    document.getElementById('game-status').innerText = 'Đêm đã xuống...';
    // Logic hiển thị hành động cho từng vai trò
    // Ví dụ: chỉ hiện nút hành động cho Kẻ phá hoại, Bảo vệ, ...
    document.getElementById('action-panel').classList.remove('hidden');
}

function handleNightActions() {
    // Logic của Kẻ phá hoại, Bảo vệ, Thám tử...
    // Mặc định không có ai bị "hạ gục" theo luật chơi mới
    
    // Chuyển sang giai đoạn Sáng
    startDay();
}

function startDay() {
    updateUIForDay();
    startTimer(dayTime, startDiscussion);
}

function updateUIForDay() {
    document.getElementById('game-status').innerText = 'Sáng rồi! Hãy xem có manh mối gì không!';
    // Hiển thị manh mối (tạm thời)
    document.getElementById('info-panel').innerText = 'Manh mối của đêm qua: ...';
    document.getElementById('info-panel').classList.remove('hidden');
}

function startDiscussion() {
    document.getElementById('game-status').innerText = 'Thảo luận (1 phút)...';
    startTimer(discussionTime, startVoting);
}

function startVoting() {
    document.getElementById('game-status').innerText = 'Bầu chọn (10 giây)...';
    // Hiển thị giao diện bầu chọn
    document.getElementById('action-panel').innerHTML = `
        <p>Bầu chọn người bạn nghĩ là Kẻ phá hoại:</p>
        <select id="vote-target"></select>
        <button id="submit-vote-btn">Bỏ phiếu</button>
    `;
    const voteSelect = document.getElementById('vote-target');
    currentGame.players.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.innerText = p.name;
        voteSelect.appendChild(option);
    });
    document.getElementById('submit-vote-btn').addEventListener('click', () => {
        // Gửi phiếu bầu (cần logic lưu trữ phiếu)
        alert('Đã bỏ phiếu!');
    });

    startTimer(voteTime, processVotes);
}

function processVotes() {
    // Logic tính điểm và công bố
    // Giả lập kết quả
    const votes = {}; // Cần logic thực tế để thu thập phiếu bầu
    const mostVotedPlayer = { id: 'player-123', role: 'Kẻ phá hoại' }; // Giả định

    document.getElementById('game-status').innerText = 'Kết quả bầu chọn:';
    document.getElementById('info-panel').innerText = `Người bị bầu nhiều nhất là ${mostVotedPlayer.name} (${mostVotedPlayer.role}).`;

    // Tính điểm (cần logic chi tiết hơn)
    // ...

    setTimeout(() => {
        currentGame.round++;
        startNewRound();
    }, 5000); // Chờ 5 giây trước khi bắt đầu vòng mới
}

function endGame() {
    document.getElementById('game-status').innerText = 'Trò chơi kết thúc!';
    // Hiển thị bảng điểm cuối cùng
    const finalScores = currentGame.players.map(p => `${p.name}: ${p.score} điểm`).join('<br>');
    document.getElementById('info-panel').innerHTML = `<h3>Bảng điểm cuối cùng:</h3>${finalScores}`;

    // Xóa phòng
    delete rooms[currentGame.id];
}

// Hàm cập nhật bộ đếm thời gian
function startTimer(duration, callback) {
    let timeLeft = duration;
    updateTimer(timeLeft);
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timer);
            callback();
        }
    }, 1000);
}

function updateTimer(timeLeft) {
    document.getElementById('time-left').innerText = timeLeft + 's';
}