// ------------------ Timer ------------------
let timerVisible = false;
let timerRunning = false;
let elapsed = 0;
let intervalId = null;

function updateTimer() {
    let sec = Math.floor(elapsed / 1000);
    let m = String(Math.floor(sec / 60)).padStart(2, '0');
    let s = String(sec % 60).padStart(2, '0');
    document.getElementById("timer").innerText = `${m}:${s}`;
}

function toggleTimer() {
    timerVisible = !timerVisible;
    document.getElementById("timer").style.display = timerVisible ? "block" : "none";
    if (timerVisible && !timerRunning) startTimer();
    if (!timerVisible) stopTimer();
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

function resetTimer() {
    elapsed = 0;
    updateTimer();
}

// ------------------ Problems ------------------
function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}

function randomProblem() {
    const t = Math.floor(Math.random() * 5);

    // ① 11〜19 × 11〜19
    if (t === 0) {
        let a = 11 + Math.floor(Math.random() * 9);
        let b = 11 + Math.floor(Math.random() * 9);
        return {q: `${a} × ${b}`, a: a * b};
    }

    // ② 素数
    if (t === 1) {
        let n = 2 + Math.floor(Math.random() * 99);
        return {q: `${n} は素数？`, a: isPrime(n) ? "YES" : "NO"};
    }

    // ③ 2桁 × 1桁
    if (t === 2) {
        let a = 10 + Math.floor(Math.random() * 90);
        let b = 1 + Math.floor(Math.random() * 9);
        return {q: `${a} × ${b}`, a: a * b};
    }

    // ④ 2桁 × 2桁
    if (t === 3) {
        let a = 10 + Math.floor(Math.random() * 90);
        let b = 10 + Math.floor(Math.random() * 90);
        return {q: `${a} × ${b}`, a: a * b};
    }

    // ⑤ 割り算
    let b = 1 + Math.floor(Math.random() * 9);
    let a = b * (2 + Math.floor(Math.random() * 20));
    return {q: `${a} ÷ ${b}`, a: a / b};
}

let current = null;

function nextCard() {
    current = randomProblem();
    document.getElementById("card").innerText = current.q;
}

function showAnswer() {
    if (current)
        document.getElementById("card").innerText = current.a;
}
