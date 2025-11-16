// ===== タイマー =====
let timerRunning = false;
let elapsed = 0;
let intervalId = null;

function updateTimer() {
    let sec = Math.floor(elapsed / 1000);
    let m = String(Math.floor(sec / 60)).padStart(2, '0');
    let s = String(sec % 60).padStart(2, '0');
    document.getElementById("timer").innerText = `${m}:${s}`;
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    intervalId = setInterval(() => {
        elapsed += 1000;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    timerRunning = false;
    clearInterval(intervalId);
}

function toggleTimer() {
    if (timerRunning) {
        stopTimer();
    } else {
        startTimer();
    }
}

function resetTimer() {
    elapsed = 0;
    updateTimer();
    stopTimer();
}

// 初期表示
updateTimer();


// ===== 問題生成 =====
function randomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
}

function randomProblem() {
    const t = Math.floor(Math.random() * 4);

    // ① 11〜19 × 11〜19
    if (t === 0) {
        let a = randomInt(11, 19);
        let b = randomInt(11, 19);
        return { q: `${a} × ${b}`, a: a * b };
    }

    // ② 2桁 × 1桁
    if (t === 1) {
        let a = randomInt(10, 99);
        let b = randomInt(1, 9);
        return { q: `${a} × ${b}`, a: a * b };
    }

    // ③ 2桁 × 2桁
    if (t === 2) {
        let a = randomInt(10, 99);
        let b = randomInt(10, 99);
        return { q: `${a} × ${b}`, a: a * b };
    }

    // ④ 割り算（割り切れる）
    let b = randomInt(1, 9);
    let x = randomInt(2, 20);
    let a = b * x;
    return { q: `${a} ÷ ${b}`, a: x };
}

let current = null;
let lastQuestion = null;

function nextCard() {
    if (!timerRunning) startTimer();

    let p;
    do {
        p = randomProblem();
    } while (lastQuestion && p.q === lastQuestion);

    lastQuestion = p.q;
    current = p;

    document.getElementById("card").innerText = current.q;
    document.getElementById("answerInput").value = "";
    document.getElementById("feedback").innerText = "";
    document.getElementById("feedback").className = "";
    document.getElementById("answerInput").focus();
}


// ===== ピンポン / ブー音 =====
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playBeep(type) {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'ok') {
        osc.frequency.value = 880;
    } else {
        osc.frequency.value = 220;
    }

    osc.type = "sine";
    const now = ctx.currentTime;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.start(now);
    osc.stop(now + 0.4);
}


// ===== 答えチェック =====
function checkAnswer() {
    const inputEl = document.getElementById("answerInput");
    const fb = document.getElementById("feedback");

    if (!current) {
        fb.innerText = "まず「次の問題」を押してね";
        fb.className = "ng";
        return;
    }

    const user = inputEl.value.trim();
    if (user === "") {
        fb.innerText = "答えを入力してね";
        fb.className = "ng";
        return;
    }

    const userNum = Number(user);
    const correct = Number(current.a);

    if (userNum === correct) {
        fb.innerText = "ピンポーン！ 正解！";
        fb.className = "ok";
        playBeep('ok');

        // 0.8秒後に次の問題
        setTimeout(() => {
            nextCard();
        }, 800);

    } else {
        fb.innerText = `ブー！ 正解は ${correct} だよ`;
        fb.className = "ng";
        playBeep('ng');

        // 1.4秒後に次の問題
        setTimeout(() => {
            nextCard();
        }, 1400);
    }
}
