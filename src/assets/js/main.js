gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       LENIS
    ========================= */

    const lenis = new Lenis({
        lerp: 0.08,
        smoothWheel: true,
        syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* =========================
       ELEMENTS
    ========================= */

    const spotlight = document.querySelector(".spotlight");

    const projectIndex = document.querySelector(".project-index h2");

    const projectImages = [...document.querySelectorAll(".project-img")];

    const projectNames = [...document.querySelectorAll(".project-name")];

    const imagesContainer = document.querySelector(".project-images");

    const progressFill = document.querySelector(".progress-fill");

    const total = projectImages.length;

    /* =========================
       INTRO ANIMATION
    ========================= */

    const introTL = gsap.timeline({
        defaults: {
            ease: "power4.out",
        },
    });

    introTL
        .from(".intro-top span", {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 1,
        })
        .from(
            ".intro .eyebrow",
            {
                y: 30,
                opacity: 0,
                duration: 0.8,
            },
            "-=0.6",
        )
        .from(
            ".intro h1",
            {
                y: 80,
                opacity: 0,
                scale: 0.96,
                duration: 1.4,
            },
            "-=0.5",
        )
        .from(
            ".intro-bottom span",
            {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.8,
            },
            "-=0.8",
        );

    /* =========================
       INITIAL IMAGE STATE
    ========================= */

    gsap.set(projectImages, {
        opacity: 0.12,
        scale: 0.92,
    });

    gsap.set(projectImages[0], {
        opacity: 1,
        scale: 1,
    });

    /* =========================
       SPOTLIGHT
    ========================= */

    ScrollTrigger.create({
        trigger: spotlight,
        start: "top top",

        end: () => `+=${window.innerHeight * 7}`,

        pin: true,
        scrub: 1,

        onUpdate: (self) => {
            const progress = self.progress;

            /* =====================
               CURRENT PROJECT
            ===================== */

            const currentIndex = Math.min(
                Math.floor(progress * total),
                total - 1,
            );

            /* =====================
               COUNTER
            ===================== */

            projectIndex.textContent = String(currentIndex + 1).padStart(
                2,
                "0",
            );

            /* =====================
               IMAGE MOVEMENT
            ===================== */

            const maxMove = imagesContainer.offsetHeight - window.innerHeight;

            gsap.set(imagesContainer, {
                y: -progress * maxMove,
            });

            /* =====================
               PROGRESS BAR
            ===================== */

            gsap.set(progressFill, {
                width: `${progress * 100}%`,
            });

            /* =====================
               ACTIVE IMAGE
            ===================== */

            projectImages.forEach((img, index) => {
                const isActive = index === currentIndex;

                gsap.to(img, {
                    opacity: isActive ? 1 : 0.12,
                    scale: isActive ? 1 : 0.92,
                    filter: isActive ? "grayscale(0)" : "grayscale(0.25)",
                    duration: 0.5,
                    overwrite: true,
                    ease: "power3.out",
                });

                if (isActive) {
                    img.classList.add("active");
                } else {
                    img.classList.remove("active");
                }
            });

            /* =====================
               PROJECT NAMES
            ===================== */

            projectNames.forEach((name, index) => {
                const isActive = index === currentIndex;

                name.classList.toggle("active", isActive);

                gsap.to(name, {
                    opacity: isActive ? 1 : 0.25,
                    x: isActive ? -8 : 0,
                    duration: 0.35,
                    overwrite: true,
                    ease: "power2.out",
                });
            });
        },
    });

    /* =========================
       IMAGE PARALLAX
    ========================= */

    projectImages.forEach((item) => {
        const image = item.querySelector("img");

        gsap.to(image, {
            yPercent: -10,

            ease: "none",

            scrollTrigger: {
                trigger: item,

                start: "top bottom",
                end: "bottom top",

                scrub: true,
            },
        });
    });

    /* =========================
       MOUSE IMAGE MOVEMENT
    ========================= */

    let mouseX = 0;
    let mouseY = 0;

    let targetX = 0;
    let targetY = 0;

    window.addEventListener("mousemove", (event) => {
        mouseX = (event.clientX / window.innerWidth - 0.5) * 12;

        mouseY = (event.clientY / window.innerHeight - 0.5) * 8;
    });

    function mouseLoop() {
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        gsap.set(".project-img.active img", {
            x: targetX,
            y: targetY,
        });

        requestAnimationFrame(mouseLoop);
    }

    mouseLoop();

    /* =========================
       OUTRO REVEAL
    ========================= */

    gsap.from(".outro-inner", {
        y: 80,
        opacity: 0,

        duration: 1,

        scrollTrigger: {
            trigger: ".outro",
            start: "top 70%",
        },
    });

    /* =========================
       RESIZE
    ========================= */

    window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
    });
});
