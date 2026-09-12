/* Hiệu ứng lá xanh & hoa anh đào rơi */
(function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'petals-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let W, H;
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Loại hạt: 0 = hoa anh đào (hồng), 1 = lá xanh
    const PINK = ['#ffb7d5', '#ff9ecb', '#ffc9e0', '#f78fb3'];
    const GREEN = ['#7bc96f', '#5aa854', '#98d98e', '#4c9a3f'];

    const COUNT = Math.min(45, Math.max(20, Math.floor(window.innerWidth / 30)));
    const particles = [];

    function rand(a, b) { return a + Math.random() * (b - a); }

    function makeParticle(fromTop) {
        const isLeaf = Math.random() < 0.35; // 35% là lá xanh
        return {
            x: rand(0, W),
            y: fromTop ? rand(-H * 0.2, -20) : rand(-H, H),
            size: isLeaf ? rand(9, 16) : rand(6, 12),
            speedY: rand(0.6, 1.6),
            speedX: rand(-0.6, 0.9),
            sway: rand(0.5, 1.8),      // biên độ lắc lư
            swaySpeed: rand(0.01, 0.03),
            angle: rand(0, Math.PI * 2),
            spin: rand(-0.03, 0.03),
            color: isLeaf
                ? GREEN[Math.floor(Math.random() * GREEN.length)]
                : PINK[Math.floor(Math.random() * PINK.length)],
            isLeaf: isLeaf,
            opacity: rand(0.65, 0.95)
        };
    }

    for (let i = 0; i < COUNT; i++) particles.push(makeParticle(false));

    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.isLeaf) {
            // Lá xanh: hình thoi dài với gân giữa
            const s = p.size;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.quadraticCurveTo(s * 0.6, 0, 0, s);
            ctx.quadraticCurveTo(-s * 0.6, 0, 0, -s);
            ctx.fill();
            // gân lá
            ctx.globalAlpha = p.opacity * 0.5;
            ctx.strokeStyle = '#2e6b28';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.8);
            ctx.lineTo(0, s * 0.8);
            ctx.stroke();
        } else {
            // Cánh hoa anh đào: hình elip mềm
            const s = p.size;
            ctx.beginPath();
            ctx.ellipse(0, 0, s * 0.75, s * 0.45, 0, 0, Math.PI * 2);
            ctx.fill();
            // điểm sáng nhạt ở giữa cánh
            ctx.globalAlpha = p.opacity * 0.35;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.ellipse(0, -s * 0.1, s * 0.3, s * 0.15, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    let t = 0;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        t++;
        for (const p of particles) {
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(t * p.swaySpeed + p.sway * 10) * p.sway;
            p.angle += p.spin;

            if (p.y > H + 30 || p.x < -40 || p.x > W + 40) {
                Object.assign(p, makeParticle(true));
            }
            drawPetal(p);
        }
        requestAnimationFrame(animate);
    }
    animate();
})();
