
    // 1. Mobile Menu Logic
    const toggleBtn = document.getElementById("menuBtn");
    const navMenu = document.getElementById("navMenu");
    const menuIcon = document.getElementById("menuIcon");

    toggleBtn.addEventListener("click", () => {
        navMenu.classList.toggle("mobile-open");

        if (navMenu.classList.contains("mobile-open")) {
            menuIcon.classList.remove("bi-list");
            menuIcon.classList.add("bi-x-lg");

            document.body.style.overflow = "hidden";
        } else {
            menuIcon.classList.remove("bi-x-lg");
            menuIcon.classList.add("bi-list");

            document.body.style.overflow = "auto";

            setTimeout(() => {
                document
                    .querySelectorAll(".mobile-sub-menu.active")
                    .forEach(menu => {
                        menu.classList.remove("active");
                    });
            }, 400);
        }
    });

    // 2. Mobile Sub-Menu Slide Logic
    const mobileDropdownBtns = document.querySelectorAll(
        ".mobile-dropdown-btn"
    );

    const backBtns = document.querySelectorAll(".back-btn");

    mobileDropdownBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();

            const subMenu =
                btn.parentElement.querySelector(".mobile-sub-menu");

            subMenu.classList.add("active");
        });
    });

    backBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const subMenu = btn.closest(".mobile-sub-menu");

            subMenu.classList.remove("active");
        });
    });

    // 3. Announcement Bar Logic
    const annSpans = document.querySelectorAll(
        "#announcementSlider span"
    );

    let annIndex = 0;
    let annTimer;

    function showAnnouncement(index) {
        annSpans.forEach(span => {
            span.classList.remove("active-announcement");
        });

        if (index >= annSpans.length) {
            annIndex = 0;
        } else if (index < 0) {
            annIndex = annSpans.length - 1;
        } else {
            annIndex = index;
        }

        annSpans[annIndex].classList.add("active-announcement");
    }

    function nextAnn() {
        showAnnouncement(annIndex + 1);
        resetAnnTimer();
    }

    function prevAnn() {
        showAnnouncement(annIndex - 1);
        resetAnnTimer();
    }

    function startAnnTimer() {
        annTimer = setInterval(() => {
            showAnnouncement(annIndex + 1);
        }, 4000);
    }

    function resetAnnTimer() {
        clearInterval(annTimer);
        startAnnTimer();
    }

    document
        .getElementById("announcementNext")
        .addEventListener("click", nextAnn);

    document
        .getElementById("announcementPrev")
        .addEventListener("click", prevAnn);

    startAnnTimer();

    // 4. Custom Product Slider Logic
    const track = document.getElementById("productTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const slideCount = document.getElementById("slideCount");

    const slides = document.querySelectorAll(".custom-slide");
    const totalSlides = slides.length;

    function updatePagination() {
        const slideWidth = slides[0].offsetWidth + 25;

        const visibleSlides = Math.round(
            track.clientWidth / slideWidth
        );

        let totalPages = totalSlides - visibleSlides + 1;

        if (totalPages < 1) {
            totalPages = 1;
        }

        const currentIndex =
            Math.round(track.scrollLeft / slideWidth) + 1;

        slideCount.innerText = `${currentIndex} / ${totalPages}`;
    }

    track.addEventListener("scroll", updatePagination);

    nextBtn.addEventListener("click", () => {
        const slideWidth = slides[0].offsetWidth + 25;

        track.scrollBy({
            left: slideWidth,
            behavior: "smooth"
        });
    });

    prevBtn.addEventListener("click", () => {
        const slideWidth = slides[0].offsetWidth + 25;

        track.scrollBy({
            left: -slideWidth,
            behavior: "smooth"
        });
    });

    updatePagination();