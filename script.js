document.addEventListener('DOMContentLoaded', () => {
    const wheel = document.querySelector('.wheel');
    const spinBtn = document.getElementById('spinBtn');
    const musicToggle = document.getElementById('musicToggle');
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    let spinning = false;

    // 设置画布大小
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 烟花类
    class Firework {
        constructor(x, y, targetX, targetY) {
            this.x = x;
            this.y = y;
            this.targetX = targetX;
            this.targetY = targetY;
            this.speed = 2;
            this.angle = Math.atan2(targetY - y, targetX - x);
            this.velocity = {
                x: Math.cos(this.angle) * this.speed,
                y: Math.sin(this.angle) * this.speed
            };
            this.particles = [];
            this.alive = true;
        }

        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (Math.abs(this.x - this.targetX) < 5 && Math.abs(this.y - this.targetY) < 5) {
                this.explode();
                this.alive = false;
            }
        }

        explode() {
            // 预定义一些鲜艳的颜色
            const colors = [
                '#FF0000', // 红色
                '#00FF00', // 绿色
                '#0000FF', // 蓝色
                '#FFD700', // 金色
                '#FF1493', // 粉色
                '#00FFFF', // 青色
                '#FF4500', // 橙红色
                '#9400D3', // 紫色
                '#FF69B4', // 粉红色
                '#00FF7F', // 春绿色
                '#FF00FF', // 洋红色
                '#FFFF00'  // 黄色
            ];
            
            // 随机选择主色调
            const mainColor = colors[Math.floor(Math.random() * colors.length)];
            
            for (let i = 0; i < 120; i++) {  // 增加粒子数量
                const angle = (Math.PI * 2 / 120) * i;
                const speed = Math.random() * 6 + 3;  // 增加速度范围
                
                // 随机选择颜色
                const particleColor = Math.random() < 0.5 ? mainColor : colors[Math.floor(Math.random() * colors.length)];
                
                // 添加粒子
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    alpha: 1,
                    color: particleColor,
                    size: Math.random() * 2 + 1  // 随机粒子大小
                });
            }
        }

        draw() {
            // 绘制上升的烟花
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();

            // 绘制爆炸粒子
            this.particles.forEach((particle, index) => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.05;  // 重力效果
                particle.alpha -= 0.01;  // 透明度衰减

                if (particle.alpha <= 0) {
                    this.particles.splice(index, 1);
                    return;
                }

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha})`;
                ctx.fill();

                // 添加粒子轨迹
                if (Math.random() < 0.3) {  // 30%的概率产生轨迹
                    ctx.beginPath();
                    ctx.arc(particle.x + (Math.random() - 0.5) * 2, 
                           particle.y + (Math.random() - 0.5) * 2, 
                           particle.size * 0.5, 
                           0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${hexToRgb(particle.color)}, ${particle.alpha * 0.5})`;
                    ctx.fill();
                }
            });
        }
    }

    // 颜色转换函数
    function hexToRgb(color) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
        return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
    }

    // 烟花数组
    let fireworks = [];

    // 创建烟花
    function createFirework() {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        const targetX = Math.random() * canvas.width;
        const targetY = Math.random() * (canvas.height * 0.5);
        fireworks.push(new Firework(x, y, targetX, targetY));
    }

    // 添加一个标志来控制是否正在进行烟花表演
    let isFireworkShow = false;

    // 修改动画循环
    function animate() {
        // 只有在烟花表演时才添加黑色背景
        if (isFireworkShow || fireworks.length > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            // 当没有烟花时，清除画布
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

        fireworks = fireworks.filter(firework => {
            firework.update();
            firework.draw();
            return firework.alive || firework.particles.length > 0;
        });

        requestAnimationFrame(animate);
    }

    // 修改开始烟花表演函数
    function startFireworks() {
        isFireworkShow = true;
        
        // 显示标题和新年快乐文字
        const title = document.getElementById('fireworksTitle');
        const newYearText = document.getElementById('newYearText');
        title.style.display = 'block';
        
        // 延迟显示新年快乐文字，制造层次感
        setTimeout(() => {
            newYearText.style.display = 'block';
        }, 1000);
        
        let count = 0;
        const totalTime = 60000; // 60秒
        const interval = 500; // 每500ms发射一个烟花
        const totalFireworks = Math.floor(totalTime / interval); // 计算总共需要发射的烟花数
        
        const fireworkInterval = setInterval(() => {
            createFirework();
            count++;
            
            // 当达到总时间后停止
            if (count >= totalFireworks) {
                clearInterval(fireworkInterval);
                // 等待最后一组烟花消失后重置标志和隐藏文字
                setTimeout(() => {
                    isFireworkShow = false;
                    title.style.display = 'none';
                    newYearText.style.display = 'none';
                }, 3000); // 给最后的烟花3秒消失时间
            }
        }, interval);
    }

    // 创建背景音乐
    const bgMusic = new Audio('audio/background-music.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // 设置初始状态为非静音，并自动播放
    let isMuted = false;
    musicToggle.classList.remove('muted');
    
    // 尝试自动播放
    bgMusic.play().catch(() => {
        // 如果自动播放失败（大多数浏览器会阻止），等待用户第一次点击页面时播放
        document.addEventListener('click', () => {
            if (!isMuted) {
                bgMusic.play();
            }
        }, { once: true });
    });

    // 音乐控制
    musicToggle.addEventListener('click', () => {
        isMuted = !isMuted;
        musicToggle.classList.toggle('muted', isMuted);
        
        if (isMuted) {
            bgMusic.pause();
        } else {
            bgMusic.play().catch(() => {
                console.log('需要用户交互才能播放音乐');
            });
        }
    });

    // 创建转盘音效
    const spinSound = new Audio('audio/spin-sound.mp3');
    spinSound.volume = 0.3;

    // 创建中奖音效
    const winSound = new Audio('audio/win-sound.mp3');
    winSound.volume = 0.5;

    spinBtn.addEventListener('click', () => {
        if (spinning) return;
        
        spinning = true;
        spinBtn.disabled = true;
        
        if (!isMuted) {
            spinSound.currentTime = 0;
            spinSound.play();
        }
        
        const rotation = 3600 + Math.floor(Math.random() * 1440);
        wheel.style.transform = `rotate(${rotation}deg)`;
        
        setTimeout(() => {
            const finalRotation = rotation % 360;
            const prizeIndex = Math.floor((360 - finalRotation) / 45);
            const prizes = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖', '八等奖'];
            
            if (!isMuted) {
                winSound.currentTime = 0;
                winSound.play();
            }
            
            // 开始烟花表演
            startFireworks();
            
            Swal.fire({
                title: '恭喜！',
                text: `您获得了${prizes[prizeIndex]}！`,
                icon: 'success',
                confirmButtonText: '太棒了'
            });
            
            spinning = false;
            spinBtn.disabled = false;
        }, 8000);
    });

    // 启动动画循环
    animate();

    // 处理页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            bgMusic.pause();
        } else if (!isMuted) {
            bgMusic.play().catch(() => {});
        }
    });
}); 