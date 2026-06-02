// Interactive JavaScript for Romantic Birthday Website

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const bgMusic = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = musicToggle.querySelector('.music-icon');
  
  const introScreen = document.getElementById('intro-screen');
  const openEnvelopeBtn = document.getElementById('open-envelope-btn');
  const mainEnvelope = document.getElementById('main-envelope');
  const mainContent = document.getElementById('main-content');
  
  const storySection = document.getElementById('story-section');
  const gallerySection = document.getElementById('gallery-section');
  const questionSection = document.getElementById('question-section');
  const celebrationSection = document.getElementById('celebration-section');
  
  const nextStoryBtn = document.getElementById('next-story-btn');
  const nextGalleryBtn = document.getElementById('next-gallery-btn');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const replayBtn = document.getElementById('replay-btn');
  
  const memoryVideo = document.getElementById('memory-video');
  
  const birthdayCake = document.getElementById('birthday-cake');
  const cakeCandle = document.getElementById('cake-candle');
  const candleFlame = document.getElementById('candle-flame');
  const candleInstruction = document.getElementById('candle-instruction');
  const candleBlownMessage = document.getElementById('candle-blown-message');

  // App State
  let musicPlaying = false;
  let activeSlideIndex = 0;
  let typewriterActive = false;
  
  // Romantic Typewriter Text content
  const storyText = `Hallo Saayaanng~
Happy birthday  many happy returns of the day.... 🥰
ini mungkin sesutu yang tidak romantis untukmu tapi om-om ini coba berikan apa yang dia bisa untuk bikin kamu senyum sampai gigimu rontok...

Seperti yang pernah saya bilang ini "bukan hari spesialmu", karena setiap hari adalah hari spesialmu. setuju ? pasti kau jawab "nda" :)

Bulan ini saya sudah siapkan beberapa hal yang mungkin buat kau senyum-senyum lagi, tapi masih rahasia ya.

doaku untuk mu meskipun pria ini tidak terlalu beriman adalah kita tetap bersama dan selalu tau jalan untuk menurunkan ego,
jangan terlalu banyak ngambek, meraju, moodian, dan yang paling penting jangan semuanya dipendam sendiri.

ingat kita ini teman hidup, jadi jangan sungkan.
bukan orang pertama yang ngucapin tapi orang yang paling terakhir yang akan tetap di sampingmu.
I will always be by your side.  I Love U 💖`;

  // ==========================================
  // 1. CANVAS PARTICLE SYSTEM (HEARTS & CONFETTI)
  // ==========================================
  const canvas = document.getElementById('hearts-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let canvasActive = false;

  // Pink flowers accumulation pile variables
  let settledPetals = [];
  let pileHeight = 0;
  let frameCount = 0;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, type = 'floating-heart') {
      this.x = x;
      this.y = y;
      this.type = type; // 'floating-heart', 'burst-heart', 'confetti', 'pink-flower', 'falling-flower'
      
      if (type === 'floating-heart') {
        this.size = Math.random() * 12 + 8;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
        this.speedY = -(Math.random() * 1.5 + 0.8);
        this.opacity = Math.random() * 0.4 + 0.2;
        this.emoji = ['❤️', '💖', '💕', '🌸'][Math.floor(Math.random() * 4)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 0.5;
      } else if (type === 'burst-heart') {
        this.size = Math.random() * 16 + 12;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 4;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 2; // Bias upwards
        this.opacity = 1;
        this.emoji = ['❤️', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];
        this.gravity = 0.12;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 4;
      } else if (type === 'confetti') {
        this.size = Math.random() * 8 + 6;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 3;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed - 3;
        this.opacity = 1;
        this.color = `hsl(${Math.random() * 360}, 90%, 65%)`;
        this.shape = Math.random() > 0.5 ? 'circle' : 'square';
        this.gravity = 0.18;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 8;
      } else if (type === 'pink-flower') {
        this.size = 2; // Start very small
        this.targetSize = Math.random() * 20 + 20; // Grows up to 20px - 40px (fills screen)
        // High velocity fountain launch upwards
        this.speedX = (Math.random() - 0.5) * 8; // wide horizontal spray
        this.speedY = -(Math.random() * 7 + 8); // high vertical spray (fountain)
        this.opacity = Math.random() * 0.4 + 0.6;
        this.emoji = ['🌸', '💮', '🏵️', '🌺', '🍃'][Math.floor(Math.random() * 5)];
        this.gravity = 0.16; // stronger gravity pulls them down after peak
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 5;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
        this.swayOffset = Math.random() * Math.PI * 2;
      } else if (type === 'falling-flower') {
        this.size = Math.random() * 10 + 7;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.emoji = ['🌸', '💮', '🏵️', '🌺', '🍃'][Math.floor(Math.random() * 5)];
        this.gravity = 0.02;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 1.5;
        this.swaySpeed = Math.random() * 0.03 + 0.01;
        this.swayOffset = Math.random() * Math.PI * 2;
      }
    }

    update() {
      if (this.type === 'floating-heart') {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // Sway
        this.rotation += this.rotationSpeed;
        if (this.y < -30) {
          // Reset bottom
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
          this.opacity = Math.random() * 0.4 + 0.2;
        }
      } else if (this.type === 'pink-flower' || this.type === 'falling-flower') {
        // Grow flower size if it's a pink-flower and hasn't reached targetSize
        if (this.type === 'pink-flower' && this.size < this.targetSize) {
          this.size += 0.6; // Grow rapidly
        }
        
        this.x += this.speedX + Math.sin(this.y * this.swaySpeed + this.swayOffset) * 0.5;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.rotation += this.rotationSpeed;
        
        // Check landing condition
        // For settled petals, keep their size capped to look nice at the bottom (e.g. max 18px)
        const currentPileY = canvas.height - pileHeight - (this.size / 3);
        if (this.y >= currentPileY) {
          // Add to settled petals list
          settledPetals.push({
            x: this.x,
            y: currentPileY + (Math.random() * 8 - 4),
            size: Math.min(18, this.size), // cap size at rest so they pack neatly
            emoji: this.emoji,
            rotation: this.rotation,
            opacity: this.opacity
          });
          
          // Increment pile height slightly
          pileHeight = Math.min(40, pileHeight + 0.25);
          
          // Limit settled array size
          if (settledPetals.length > 200) {
            settledPetals.shift();
          }
          
          // Remove active particle
          this.opacity = 0;
        }
      } else {
        // Exploding particles
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.rotation += this.rotationSpeed;
        this.opacity -= 0.015;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      
      if (this.type === 'floating-heart' || this.type === 'burst-heart') {
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.emoji, 0, 0);
      } else if (this.type === 'confetti') {
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
      }
      
      ctx.restore();
    }
  }

  // Spawn background floaters
  function initBackgroundHearts() {
    particles = [];
    const particleCount = Math.min(25, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(
        Math.random() * canvas.width,
        Math.random() * canvas.height + canvas.height,
        'floating-heart'
      ));
    }
  }

  function triggerBurst(x, y, count, type) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, type));
    }
  }

  function animateParticles() {
    if (!canvasActive) return;
    
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spawn falling flowers dynamically based on active slide index
    frameCount++;
    // Spawn falling flowers every 8 frames (~130ms) during reading (slide index 0)
    // and every 25 frames (~400ms) on other slides (gentle cherry blossom wind)
    const spawnRate = activeSlideIndex === 0 ? 8 : 25;
    if (frameCount % spawnRate === 0) {
      particles.push(new Particle(Math.random() * canvas.width, -20, 'falling-flower'));
    }
    
    // 1. Draw base soft pink mound representing accumulated flower pile
    if (pileHeight > 0) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 179, 193, 0.35)'; // soft pink mound
      ctx.beginPath();
      ctx.ellipse(canvas.width / 2, canvas.height, canvas.width / 2 + 100, pileHeight, 0, Math.PI, 0);
      ctx.fill();
      ctx.restore();
    }
    
    // 2. Draw settled petals
    settledPetals.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.font = `${p.size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    });
    
    // 3. Update and draw active particles
    particles = particles.filter(p => p.opacity > 0);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animateParticles);
  }

  function startCanvasSystem() {
    canvasActive = true;
    initBackgroundHearts();
    animateParticles();
  }

  // ==========================================
  // 2. AUDIO MUSIC CONTROL
  // ==========================================
  function playMusic() {
    bgMusic.play()
      .then(() => {
        musicPlaying = true;
        musicToggle.classList.remove('hidden');
        musicIcon.classList.add('playing');
      })
      .catch(err => {
        console.log("Audio autoplay blocked or failed:", err);
      });
  }

  function toggleMusic() {
    if (musicPlaying) {
      bgMusic.pause();
      musicPlaying = false;
      musicIcon.classList.remove('playing');
    } else {
      bgMusic.play();
      musicPlaying = true;
      musicIcon.classList.add('playing');
    }
  }

  musicToggle.addEventListener('click', toggleMusic);

  // ==========================================
  // 3. ENVELOPE OPENING & START EXPERIENCE
  // ==========================================
  openEnvelopeBtn.addEventListener('click', () => {
    mainEnvelope.classList.add('open');
    openEnvelopeBtn.classList.remove('pulse');
    openEnvelopeBtn.disabled = true;
    
    // Start music & visual engines immediately so particles are visible during envelope animation
    playMusic();
    startCanvasSystem();
    
    // Find the sliding letter card element
    const letterCard = mainEnvelope.querySelector('.letter');
    
    // Phase 1: Gentle stream of petals emerging from the rising letter card
    let spawnTicks = 0;
    const letterSpawnInterval = setInterval(() => {
      if (spawnTicks >= 14 || !canvasActive) { // ~1.1 seconds
        clearInterval(letterSpawnInterval);
        return;
      }
      
      const rect = letterCard.getBoundingClientRect();
      const lx = rect.left + rect.width / 2 + (Math.random() * 80 - 40);
      const ly = rect.top; // Shoot from the top edge of the rising letter
      
      // Spawn 2 petals rising gently
      for (let i = 0; i < 2; i++) {
        const p = new Particle(lx, ly, 'pink-flower');
        // Gentle upward speed
        p.speedX = (Math.random() - 0.5) * 3;
        p.speedY = -(Math.random() * 4 + 2);
        particles.push(p);
      }
      
      spawnTicks++;
    }, 80);
    
    // Phase 2: The Grand Fountain Burst from the letter at 1.1 seconds (peak pop-up)
    setTimeout(() => {
      if (!canvasActive) return;
      const rect = letterCard.getBoundingClientRect();
      const lx = rect.left + rect.width / 2;
      const ly = rect.top;
      
      // Spawn 80 petals shooting high in a massive fountain from the letter!
      for (let i = 0; i < 80; i++) {
        const p = new Particle(lx, ly, 'pink-flower');
        // Give them a strong upward fountain spray
        p.speedX = (Math.random() - 0.5) * 12; // wider spray
        p.speedY = -(Math.random() * 9 + 9); // very high vertical spray
        p.size = 2; // start small
        p.targetSize = Math.random() * 25 + 20; // grow very large (20 to 45px) to fill screen
        particles.push(p);
      }
    }, 1100);
    
    // Phase 3: Transition to the main page at 1.8 seconds (giving the burst time to spray)
    setTimeout(() => {
      introScreen.classList.add('fade-out');
      mainContent.classList.remove('hidden');
      
      // Start first slide sequence
      setTimeout(() => {
        startTypewriter();
      }, 500);
    }, 1800); // Changed from 1500 to 1800 to let the fountain peak beautifully
  });

  // ==========================================
  // 4. TYPEWRITER STORYTELLER ENGINE
  // ==========================================
  let typewriterTimeout;
  
  function startTypewriter() {
    if (typewriterActive) return;
    typewriterActive = true;
    
    const container = document.getElementById('typewriter-text');
    container.innerHTML = '';
    
    let charIndex = 0;
    nextStoryBtn.disabled = true;
    
    function type() {
      if (charIndex < storyText.length) {
        const char = storyText.charAt(charIndex);
        
        // Custom color styling for emojis in line
        if (char === '❤️' || char === '💖' || char === '💕' || char === '✨' || char === '🌸' || char === '🥰') {
          // Wait, look ahead for emojis
          container.innerHTML += `<em>${char}</em>`;
        } else {
          container.innerHTML += char;
        }
        
        // Auto scroll the letter paper container as it types
        const paper = storySection.querySelector('.letter-paper');
        if (paper) {
          paper.scrollTop = paper.scrollHeight;
        }
        
        charIndex++;
        typewriterTimeout = setTimeout(type, 35);
      } else {
        typewriterActive = false;
        nextStoryBtn.disabled = false;
        nextStoryBtn.classList.add('pulse');
      }
    }
    
    type();
  }

  nextStoryBtn.addEventListener('click', () => {
    nextStoryBtn.classList.remove('pulse');
    transitionToSlide(1); // Go to Gallery
  });

  // ==========================================
  // 5. INTERACTIVE POLAROID CARD SHUFFLE (REPLACED BY STATIC VIDEO COMPONENT)
  // ==========================================

  nextGalleryBtn.addEventListener('click', () => {
    transitionToSlide(2); // Go to Question
  });

  // ==========================================
  // 6. ESCAPING "NO" BUTTON ENGINE (TOUCH/HOVER)
  // ==========================================
  function moveNoButton() {
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    
    // Append to questionSection so position: absolute is relative to the card,
    // avoiding the parent backdrop-filter/transform containing block bug
    if (noBtn.parentNode !== questionSection) {
      questionSection.appendChild(noBtn);
    }
    
    noBtn.style.position = 'absolute';
    noBtn.style.zIndex = '999';
    
    // Find card dimensions
    const cardWidth = questionSection.clientWidth;
    const cardHeight = questionSection.clientHeight;
    
    // Boundaries to prevent button from escaping borders
    const bufferX = 20;
    const minY = 100; // Leave space at the top so it doesn't cover title/indicator
    const maxY = cardHeight - btnHeight - 20;
    const maxX = cardWidth - btnWidth - bufferX;
    
    // Generate new random coordinate relative to the card
    let newX = Math.max(bufferX, Math.floor(Math.random() * maxX));
    let newY = Math.max(minY, Math.floor(Math.random() * maxY));
    
    // Get YES button position relative to the card to prevent overlap
    const yesRect = yesBtn.getBoundingClientRect();
    const cardRect = questionSection.getBoundingClientRect();
    const yesLeft = yesRect.left - cardRect.left;
    const yesRight = yesRect.right - cardRect.left;
    const yesTop = yesRect.top - cardRect.top;
    const yesBottom = yesRect.bottom - cardRect.top;
    
    const isOverlappingYes = (
      newX < yesRight + 15 && 
      newX + btnWidth > yesLeft - 15 && 
      newY < yesBottom + 15 && 
      newY + btnHeight > yesTop - 15
    );
    
    if (isOverlappingYes) {
      newX = (newX + 160) % maxX;
      if (newX < bufferX) newX = bufferX;
      newY = (newY + 120) % maxY;
      if (newY < minY) newY = minY;
    }
    
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
    
    // Trigger small star bursts when it escapes (use viewport coordinates for particles)
    const absoluteX = cardRect.left + newX + btnWidth / 2;
    const absoluteY = cardRect.top + newY + btnHeight / 2;
    triggerBurst(absoluteX, absoluteY, 4, 'confetti');
  }

  // Desktop hover escape
  noBtn.addEventListener('mouseover', moveNoButton);

  // Mobile touch escape
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent virtual click events
    moveNoButton();
  });

  // Handle "YES" click
  yesBtn.addEventListener('click', () => {
    // Huge Heart Confetti Burst!
    const rect = yesBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    triggerBurst(centerX, centerY, 60, 'burst-heart');
    
    setTimeout(() => {
      transitionToSlide(3); // Go to Celebration
    }, 800);
  });

  function resetNoButton() {
    noBtn.style.position = '';
    noBtn.style.left = '';
    noBtn.style.top = '';
    noBtn.style.zIndex = '';
    
    // Move it back inside the decision-container
    const decisionArea = document.getElementById('decision-area');
    if (noBtn.parentNode !== decisionArea) {
      decisionArea.appendChild(noBtn);
    }
  }

  // ==========================================
  // 7. CAKE CANDLE INTERACTION (BLOW CANDLE)
  // ==========================================
  birthdayCake.addEventListener('click', blowCandle);
  
  function blowCandle() {
    if (cakeCandle.classList.contains('blown')) return;
    
    cakeCandle.classList.add('blown');
    candleInstruction.classList.add('hidden');
    candleBlownMessage.classList.remove('hidden');
    
    // Confetti and celebration explosion from the candle's position!
    const candleRect = candleFlame.getBoundingClientRect();
    const cX = candleRect.left + candleRect.width / 2;
    const cY = candleRect.top + candleRect.height / 2;
    
    // Spark smoke and confetti
    triggerBurst(cX, cY - 20, 80, 'confetti');
    triggerBurst(cX, cY - 20, 20, 'burst-heart');
    
    // Continuous random mini bursts for 3 seconds
    let burstCount = 0;
    const burstInterval = setInterval(() => {
      if (burstCount > 8) {
        clearInterval(burstInterval);
        return;
      }
      const randomX = Math.random() * window.innerWidth;
      const randomY = Math.random() * (window.innerHeight * 0.6);
      triggerBurst(randomX, randomY, 15, 'confetti');
      burstCount++;
    }, 300);
  }

  // ==========================================
  // 8. SLIDE ROUTER / PAGE TRANSITIONS
  // ==========================================
  const slides = [
    storySection,
    gallerySection,
    questionSection,
    celebrationSection
  ];

  function transitionToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    
    // Hide current slide
    slides[activeSlideIndex].classList.remove('active');
    
    // Set new index
    activeSlideIndex = index;
    
    // Reset typewriter or escaping button state if needed
    if (activeSlideIndex !== 0) {
      clearTimeout(typewriterTimeout);
      typewriterActive = false;
    }
    
    if (activeSlideIndex !== 2) {
      resetNoButton();
    }
    
    // Play or reset video if on video slide
    if (activeSlideIndex === 1 && memoryVideo) {
      memoryVideo.currentTime = 0;
      memoryVideo.play().catch(e => console.log("Video autoplay blocked:", e));
    } else if (memoryVideo) {
      memoryVideo.pause();
    }

    // Show next slide with transition delay
    setTimeout(() => {
      slides[activeSlideIndex].classList.add('active');
      
      // Trigger animations inside new slide
      if (activeSlideIndex === 0) {
        startTypewriter();
      }
    }, 400);
  }

  // Replay Experience
  replayBtn.addEventListener('click', () => {
    // Reset Candle State
    cakeCandle.classList.remove('blown');
    candleInstruction.classList.remove('hidden');
    candleBlownMessage.classList.add('hidden');
    
    // Reset Video
    if (memoryVideo) {
      memoryVideo.pause();
      memoryVideo.currentTime = 0;
    }
    
    // Reset Flower Pile
    settledPetals = [];
    pileHeight = 0;
    
    // Reset slide
    transitionToSlide(0);
  });
});
