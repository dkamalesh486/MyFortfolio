const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nav = document.querySelector(".nav");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuIcon = menuToggle.querySelector("i");

    function setMenuOpen(open) {
      nav.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuIcon.className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars";
    }

    menuToggle.addEventListener("click", () => {
      setMenuOpen(!nav.classList.contains("open"));
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.contains(event.target)) setMenuOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setMenuOpen(false);
    });

    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = [...document.querySelectorAll(".nav-links a")];

    function updateScrollState() {

      const current = sections
        .filter((section) => window.scrollY >= section.offsetTop - 180)
        .pop();

      navLinks.forEach((link) => {
        link.classList.toggle("active", current && link.getAttribute("href") === `#${current.id}`);
      });
    }
    window.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    const roles = [
      "Python-powered web experiences",
      "database-backed full-stack flows",
      "clean frontend interfaces",
      "data-informed project systems"
    ];
    const roleTarget = document.getElementById("role-type");
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeRole() {
      if (reduceMotion) {
        roleTarget.textContent = roles[0];
        return;
      }

      const word = roles[roleIndex];
      roleTarget.textContent = word.slice(0, charIndex);

      if (!deleting && charIndex < word.length) {
        charIndex += 1;
        setTimeout(typeRole, 58);
      } else if (!deleting) {
        deleting = true;
        setTimeout(typeRole, 1300);
      } else if (charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeRole, 30);
      } else {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeRole, 260);
      }
    }
    typeRole();

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });
    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        const end = Number(target.dataset.count);
        const duration = reduceMotion ? 1 : 1100;
        const start = performance.now();

        function tick(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          target.textContent = Math.round(end * eased);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.width = entry.target.dataset.width;
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.45 });
    document.querySelectorAll(".fill").forEach((bar) => barObserver.observe(bar));

    const glow = document.querySelector(".cursor-glow");
    window.addEventListener("pointermove", (event) => {
      if (reduceMotion) return;
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }, { passive: true });

    document.querySelectorAll(".tilt").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        if (reduceMotion) return;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -8;
        const rotateY = ((x / rect.width) - 0.5) * 8;
        card.style.setProperty("--x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--y", `${(y / rect.height) * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".magnetic").forEach((button) => {
      button.addEventListener("pointermove", (event) => {
        if (reduceMotion || button.getAttribute("aria-disabled") === "true") return;
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        button.style.transform = `translate(${x * 0.18}px, ${y * 0.28}px)`;
      });
      button.addEventListener("pointerleave", () => {
        button.style.transform = "";
      });
    });

    const canvas = document.querySelector(".particles");
    const ctx = canvas.getContext("2d");
    let particles = [];

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(86, Math.floor(window.innerWidth / 16));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.6 + 0.35,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        a: Math.random() * 0.45 + 0.16
      }));
    }

    function animateParticles() {
      if (reduceMotion) return;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 221, 255, ${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(83, 229, 255, ${0.12 * (1 - dist / 110)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animateParticles();
