/* =========================================================
   MODERN PORTFOLIO - FINAL
   Muhammad Ajik Al Khusain
   ========================================================= */

let portfolioProjects = [];
let projectModalImages = [];
let projectModalIndex = 0;

/* =========================================================
   HELPERS
   ========================================================= */

function escapeHTML(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function normalizePhone(phone = "") {
    let number = String(phone).replace(/\D/g, "");

    if (number.startsWith("0")) {
        number = "62" + number.slice(1);
    }

    return number;
}

/* =========================================================
   1. LOAD DATA
   ========================================================= */

async function loadData() {
    const files = [
        "data/profile.json",
        "data/education.json",
        "data/experience.json",
        "data/projects.json",
        "data/certificates.json"
    ];

    try {
        const responses = await Promise.all(
            files.map(file => fetch(file, { cache: "no-cache" }))
        );

        const failed = responses.findIndex(response => !response.ok);

        if (failed !== -1) {
            throw new Error(`Gagal membaca ${files[failed]}`);
        }

        const [
            profileData,
            educationData,
            experienceData,
            projectsData,
            certificatesData
        ] = await Promise.all(
            responses.map(response => response.json())
        );

        portfolioProjects = Array.isArray(projectsData)
            ? projectsData
            : [];

        renderProfile(profileData);
        renderEducation(educationData);
        renderExperience(experienceData);
        renderProjects(portfolioProjects);
        renderCertificates(certificatesData);

        const year = document.getElementById("current-year");
        if (year) {
            year.textContent = new Date().getFullYear();
        }

        setupNavigation();
        setupMobileMenu();
        setupRevealAnimation();
        createParticles();
        setupProjectTilt();
        setupCursorGlow();
        setupParallax();
        setupProjectFilter();
        setupProjectModal();
        setupCertificatePreview();
        setupContactActions(profileData);

        document.body.classList.add("portfolio-ready");

    } catch (error) {
        console.error("Portfolio error:", error);
        showLoadError(error);
    }
}

/* =========================================================
   LOAD ERROR
   ========================================================= */

function showLoadError(error) {
    const message = document.createElement("div");
    message.className = "portfolio-load-error";
    message.innerHTML = `
        <strong>Portfolio data could not be loaded.</strong>
        <span>Please run the project with VS Code Live Server and refresh.</span>
    `;

    document.body.appendChild(message);
}

/* =========================================================
   2. PROFILE
   ========================================================= */

function renderProfile(data = {}) {
    const name = document.getElementById("profile-name");
    const description = document.getElementById("profile-description");
    const email = document.getElementById("profile-email");
    const phone = document.getElementById("profile-phone");
    const profileLocation = document.getElementById("profile-location");
    const profilePic = document.getElementById("profile-pic");

    if (name) {
        name.textContent = data.name || "";
    }

    if (description) {
        description.textContent = data.description || "";
    }

    if (email) {
        email.textContent = data.email || "";
    }

    if (phone) {
        phone.textContent = data.phone || "";
    }

    if (profileLocation) {
        profileLocation.textContent = data.location || "";
    }

    if (profilePic && data.profileImage) {
        profilePic.src = data.profileImage;
        profilePic.alt = `${data.name || "Profile"} profile picture`;
    }

    const emailLink = document.getElementById("email-link");
    if (emailLink && data.email) {
        emailLink.href = `mailto:${data.email}`;
    }

    const phoneLink = document.getElementById("phone-link");
    if (phoneLink && data.phone) {
        phoneLink.href = `tel:${normalizePhone(data.phone)}`;
    }

    const socialLinks = document.getElementById("social-links");

    if (socialLinks && Array.isArray(data.socialMedia)) {
        socialLinks.innerHTML = "";

        const iconMap = {
            github: "fab fa-github",
            linkedin: "fab fa-linkedin-in",
            instagram: "fab fa-instagram",
            facebook: "fab fa-facebook-f",
            youtube: "fab fa-youtube",
            twitter: "fab fa-x-twitter",
            whatsapp: "fab fa-whatsapp"
        };

        data.socialMedia.forEach(social => {
            if (!social.url) return;

            const link = document.createElement("a");
            const platform = String(social.platform || "").toLowerCase();

            link.href = social.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.setAttribute(
                "aria-label",
                social.platform || "Social media"
            );

            const icon = document.createElement("i");
            icon.className = iconMap[platform] || "fas fa-link";

            link.appendChild(icon);
            socialLinks.appendChild(link);
        });
    }

    const skillsGrid = document.getElementById("skills-grid");

    if (skillsGrid && Array.isArray(data.skills)) {
        skillsGrid.innerHTML = "";

        data.skills.forEach(skill => {
            const item = document.createElement("div");
            item.className = "skill-item";

            item.innerHTML = `
                ${
                    skill.icon
                        ? `<div class="skill-icon">
                               <i class="${escapeHTML(skill.icon)}"></i>
                           </div>`
                        : ""
                }

                <div>
                    <div class="skill-name">
                        ${escapeHTML(skill.name || "")}
                    </div>
                </div>
            `;

            skillsGrid.appendChild(item);
        });
    }

    const cvLink = document.getElementById("cv-download");

    if (cvLink && data.cv?.file) {
        cvLink.href = data.cv.file;
        cvLink.target = "_blank";
        cvLink.rel = "noopener noreferrer";
        cvLink.setAttribute("download", "");

        if (data.cv.icon) {
            const icon = cvLink.querySelector("i");
            if (icon) {
                icon.className = data.cv.icon;
            }
        }
    }
}

/* =========================================================
   3. EDUCATION
   ========================================================= */

function renderEducation(data) {
    const container = document.getElementById("education-list");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach(edu => {
        const item = document.createElement("article");
        item.className = "education-item reveal";

        item.innerHTML = `
            <div class="edu-header">
                ${
                    edu.logo
                        ? `<img
                            src="${escapeHTML(edu.logo)}"
                            alt="${escapeHTML(edu.university || "Education")} logo"
                            class="edu-logo"
                            loading="lazy"
                          >`
                        : ""
                }

                <div>
                    <h3>${escapeHTML(edu.university || "")}</h3>
                    <p class="degree">${escapeHTML(edu.major || "")}</p>
                </div>
            </div>

            <p class="year">${escapeHTML(edu.year || "")}</p>
            ${edu.gpa ? `<p class="education-gpa"><i class="fas fa-graduation-cap"></i> GPA ${escapeHTML(edu.gpa)}</p>` : ""}
            <p>${escapeHTML(edu.description || "")}</p>
        `;

        container.appendChild(item);
    });
}

/* =========================================================
   4. EXPERIENCE
   ========================================================= */

function renderExperience(data) {
    const container = document.getElementById("experience-list");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach(exp => {
        const item = document.createElement("article");
        item.className = "experience-item reveal";

        item.innerHTML = `
            <div class="exp-header">
                ${
                    exp.logo
                        ? `<img
                            src="${escapeHTML(exp.logo)}"
                            alt="${escapeHTML(exp.company || "Company")} logo"
                            class="exp-logo"
                            loading="lazy"
                          >`
                        : ""
                }

                <div>
                    <h3>${escapeHTML(exp.company || "")}</h3>
                    <p class="position">${escapeHTML(exp.position || "")}</p>
                </div>
            </div>

            <p class="duration">${escapeHTML(exp.year || "")}</p>

            <p>${escapeHTML(exp.description || "")}</p>
        `;

        container.appendChild(item);
    });
}

/* =========================================================
   5. PROJECTS
   ========================================================= */

function renderProjects(data) {
    const container = document.getElementById("projects-grid");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach((project, projectIndex) => {
        let currentImage = 0;

        const images =
            Array.isArray(project.images) && project.images.length
                ? project.images
                : project.image
                    ? [project.image]
                    : [];

        const card = document.createElement("article");

        card.className = "project-card reveal";
        card.dataset.category = project.category || "all";
        card.dataset.projectIndex = projectIndex;

        card.innerHTML = `
            ${
                images.length
                    ? `
                        <div class="project-image">
                            <button
                                class="prev-btn"
                                type="button"
                                aria-label="Previous image"
                            >
                                &#10094;
                            </button>

                            <img
                                src="${escapeHTML(images[0])}"
                                alt="${escapeHTML(project.title || "Project")}"
                                class="slider-image"
                                loading="lazy"
                            >

                            <button
                                class="next-btn"
                                type="button"
                                aria-label="Next image"
                            >
                                &#10095;
                            </button>
                        </div>
                    `
                    : ""
            }

            <div class="project-content">

                <div class="project-category">
                    ${escapeHTML(project.category || "Project")}
                </div>

                <h3>${escapeHTML(project.title || "")}</h3>

                <div class="project-meta">

                    ${
                        project.year
                            ? `<span>
                                <i class="fas fa-calendar"></i>
                                ${escapeHTML(project.year)}
                              </span>`
                            : ""
                    }

                    ${
                        project.role
                            ? `<span>
                                <i class="fas fa-user"></i>
                                ${escapeHTML(project.role)}
                              </span>`
                            : ""
                    }

                </div>

                <p>${escapeHTML(project.description || "")}</p>

                ${
                    project.link && project.link !== "#"
                        ? `
                            <a
                                href="${escapeHTML(project.link)}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View Project
                                <i class="fas fa-arrow-right"></i>
                            </a>
                          `
                        : ""
                }

            </div>
        `;

        if (images.length) {
            const image = card.querySelector(".slider-image");
            const nextButton = card.querySelector(".next-btn");
            const prevButton = card.querySelector(".prev-btn");

            if (images.length <= 1) {
                nextButton?.remove();
                prevButton?.remove();
            } else {
                nextButton?.addEventListener("click", event => {
                    event.stopPropagation();

                    currentImage =
                        (currentImage + 1) % images.length;

                    changeProjectImage(
                        image,
                        images[currentImage]
                    );
                });

                prevButton?.addEventListener("click", event => {
                    event.stopPropagation();

                    currentImage--;

                    if (currentImage < 0) {
                        currentImage = images.length - 1;
                    }

                    changeProjectImage(
                        image,
                        images[currentImage]
                    );
                });
            }
        }

        container.appendChild(card);
    });
}

function changeProjectImage(image, newSource) {
    if (!image) return;

    image.style.opacity = "0";

    window.setTimeout(() => {
        image.src = newSource;
        image.style.opacity = "1";
    }, 180);
}

/* =========================================================
   6. CERTIFICATES
   ========================================================= */

function renderCertificates(data) {
    const container =
        document.getElementById("certificates-grid");

    if (!container) return;

    container.innerHTML = "";

    if (!Array.isArray(data)) return;

    data.forEach(cert => {
        const card = document.createElement("article");
        card.className = "certificate-card reveal";

        card.innerHTML = `
            ${
                cert.image
                    ? `<img
                        src="${escapeHTML(cert.image)}"
                        alt="${escapeHTML(cert.title || "Certificate")}"
                        loading="lazy"
                      >`
                    : ""
            }

            <div class="certificate-info">

                <h3>${escapeHTML(cert.title || "")}</h3>

                <p>${escapeHTML(cert.issuer || "")}</p>

                <p>${escapeHTML(cert.year || "")}</p>

                ${
                    cert.file
                        ? `<a
                            href="${escapeHTML(cert.file)}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="certificate-btn"
                          >
                            <i class="fas fa-file-pdf"></i>
                            View Certificate
                          </a>`
                        : ""
                }

            </div>
        `;

        container.appendChild(card);
    });
}

/* =========================================================
   7. NAVIGATION
   ========================================================= */

function setupNavigation() {
    const sections =
        document.querySelectorAll("main section[id]");

    const navLinks =
        document.querySelectorAll(".main-nav .nav-link");

    if (!sections.length || !navLinks.length) return;

    function updateActiveNav() {
        const scrollPosition =
            window.scrollY + window.innerHeight * 0.35;

        let current = "profile";

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition) {
                current = section.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === `#${current}`
            );
        });
    }

    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();

    navLinks.forEach(link => {
        link.addEventListener("click", event => {
            const targetId =
                link.getAttribute("href");

            if (!targetId?.startsWith("#")) return;

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            const header =
                document.querySelector(".site-header");

            const headerOffset =
                (header?.offsetHeight || 78) + 10;

            const position =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerOffset;

            window.scrollTo({
                top: Math.max(0, position),
                behavior: "smooth"
            });
        });
    });
}

/* =========================================================
   8. MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
    const button =
        document.getElementById("mobile-menu-btn");

    const nav =
        document.querySelector(".main-nav");

    if (!button || !nav) return;

    button.addEventListener("click", () => {
        const open =
            nav.classList.toggle("mobile-open");

        button.setAttribute(
            "aria-expanded",
            String(open)
        );

        button.setAttribute(
            "aria-label",
            open
                ? "Close navigation"
                : "Open navigation"
        );

        button.innerHTML = open
            ? '<i class="fas fa-xmark"></i>'
            : '<i class="fas fa-bars"></i>';
    });

    nav.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("mobile-open");

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.setAttribute(
                "aria-label",
                "Open navigation"
            );

            button.innerHTML =
                '<i class="fas fa-bars"></i>';
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 800) {
            nav.classList.remove("mobile-open");

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.innerHTML =
                '<i class="fas fa-bars"></i>';
        }
    });
}

/* =========================================================
   9. REVEAL
   ========================================================= */

function setupRevealAnimation() {
    const elements =
        document.querySelectorAll(".reveal");

    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach(element =>
            element.classList.add("active")
        );
        return;
    }

    const observer =
        new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

    elements.forEach(element =>
        observer.observe(element)
    );
}

/* =========================================================
   10. PARTICLES
   ========================================================= */

function createParticles() {
    const container =
        document.getElementById("particles");

    if (!container || container.children.length) return;

    const amount =
        window.innerWidth < 600 ? 35 : 70;

    const fragment =
        document.createDocumentFragment();

    for (let i = 0; i < amount; i++) {
        const particle =
            document.createElement("span");

        const size =
            Math.random() * 2.5 + 1;

        particle.className = "particle";

        particle.style.left =
            `${Math.random() * 100}%`;

        particle.style.top =
            `${Math.random() * 100}%`;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particle.style.animationDelay =
            `${Math.random() * 4}s`;

        particle.style.animationDuration =
            `${2 + Math.random() * 4}s`;

        fragment.appendChild(particle);
    }

    container.appendChild(fragment);
}

/* =========================================================
   11. PROJECT TILT
   ========================================================= */

function setupProjectTilt() {
    if (window.innerWidth < 900) return;

    const cards =
        document.querySelectorAll(".project-card");

    cards.forEach(card => {
        card.addEventListener("mousemove", event => {
            if (card.classList.contains("is-hidden")) return;

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            const centerX =
                rect.width / 2;

            const centerY =
                rect.height / 2;

            const rotateX =
                (y - centerY) / 35;

            const rotateY =
                (centerX - x) / 35;

            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* =========================================================
   12. CURSOR GLOW
   ========================================================= */

function setupCursorGlow() {
    if (
        window.innerWidth < 900 ||
        document.querySelector(".cursor-glow")
    ) {
        return;
    }

    const glow =
        document.createElement("div");

    glow.className = "cursor-glow";

    document.body.appendChild(glow);

    window.addEventListener(
        "mousemove",
        event => {
            glow.style.left =
                `${event.clientX}px`;

            glow.style.top =
                `${event.clientY}px`;
        },
        { passive: true }
    );
}

/* =========================================================
   13. PARALLAX
   ========================================================= */

function setupParallax() {
    const hero =
        document.querySelector(".hero-section");

    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    window.addEventListener(
        "scroll",
        () => {
            const scroll = window.scrollY;

            if (scroll < 900) {
                hero.style.transform =
                    `translateY(${scroll * 0.02}px)`;
            }
        },
        { passive: true }
    );
}

/* =========================================================
   14. PROJECT FILTER
   ========================================================= */

function setupProjectFilter() {
    const buttons =
        document.querySelectorAll(".filter-btn");

    const cards =
        document.querySelectorAll(".project-card");

    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const filter =
                String(button.dataset.filter || "all").toLowerCase();

            buttons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            cards.forEach(card => {
                const category =
                    String(card.dataset.category || "all").toLowerCase();

                const show =
                    filter === "all" ||
                    category === filter;

                card.classList.toggle(
                    "is-hidden",
                    !show
                );

                if (show) {
                    card.style.opacity = "1";
                    card.style.transform = "";
                }
            });
        });
    });
}

/* =========================================================
   15. PROJECT MODAL
   ========================================================= */

function setupProjectModal() {
    const modal =
        document.getElementById("project-modal");

    const modalImage =
        document.getElementById("modal-image");

    const modalTitle =
        document.getElementById("modal-title");

    const modalDescription =
        document.getElementById("modal-description");

    const closeButton =
        document.getElementById("modal-close");

    const nextButton =
        document.getElementById("modal-next");

    const prevButton =
        document.getElementById("modal-prev");

    if (!modal || !modalImage) return;

    document.querySelectorAll(".project-card").forEach(card => {
        const image =
            card.querySelector(".slider-image");

        if (!image) return;

        image.style.cursor = "zoom-in";

        image.addEventListener("click", () => {
            const index =
                Number(card.dataset.projectIndex);

            const project =
                portfolioProjects[index];

            projectModalImages =
                Array.isArray(project?.images)
                    ? project.images
                    : [image.src];

            if (!projectModalImages.length) {
                projectModalImages = [image.src];
            }

            projectModalIndex = 0;

            modalImage.src =
                projectModalImages[0];

            modalImage.alt =
                project?.title || "Project preview";

            modalTitle.textContent =
                project?.title || "";

            modalDescription.textContent =
                project?.description || "";

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");

            document.body.style.overflow = "hidden";

            updateModalControls();
        });
    });

    function updateModalControls() {
        const multiple =
            projectModalImages.length > 1;

        if (nextButton) {
            nextButton.style.display =
                multiple ? "flex" : "none";
        }

        if (prevButton) {
            prevButton.style.display =
                multiple ? "flex" : "none";
        }
    }

    function closeModal() {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    closeButton?.addEventListener(
        "click",
        closeModal
    );

    nextButton?.addEventListener("click", () => {
        if (projectModalImages.length <= 1) return;

        projectModalIndex =
            (projectModalIndex + 1) %
            projectModalImages.length;

        modalImage.src =
            projectModalImages[projectModalIndex];
    });

    prevButton?.addEventListener("click", () => {
        if (projectModalImages.length <= 1) return;

        projectModalIndex--;

        if (projectModalIndex < 0) {
            projectModalIndex =
                projectModalImages.length - 1;
        }

        modalImage.src =
            projectModalImages[projectModalIndex];
    });

    modal.addEventListener("click", event => {
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {
        if (!modal.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeModal();
        }

        if (event.key === "ArrowRight") {
            nextButton?.click();
        }

        if (event.key === "ArrowLeft") {
            prevButton?.click();
        }
    });
}

/* =========================================================
   16. CERTIFICATE PREVIEW
   ========================================================= */

function setupCertificatePreview() {
    document
        .querySelectorAll(".certificate-card img")
        .forEach(image => {
            image.style.cursor = "zoom-in";

            image.addEventListener("click", () => {
                const overlay =
                    document.createElement("div");

                overlay.className =
                    "certificate-preview";

                overlay.innerHTML = `
                    <button
                        class="certificate-close"
                        type="button"
                        aria-label="Close certificate preview"
                    >
                        <i class="fas fa-xmark"></i>
                    </button>

                    <img
                        src="${escapeHTML(image.src)}"
                        alt="${escapeHTML(image.alt)}"
                    >
                `;

                document.body.appendChild(overlay);
                document.body.style.overflow = "hidden";

                const close =
                    overlay.querySelector(".certificate-close");

                function closePreview() {
                    overlay.remove();
                    document.body.style.overflow = "";
                }

                close?.addEventListener(
                    "click",
                    closePreview
                );

                overlay.addEventListener(
                    "click",
                    event => {
                        if (event.target === overlay) {
                            closePreview();
                        }
                    }
                );

                document.addEventListener(
                    "keydown",
                    function escape(event) {
                        if (event.key === "Escape") {
                            closePreview();
                            document.removeEventListener(
                                "keydown",
                                escape
                            );
                        }
                    }
                );
            });
        });
}

/* =========================================================
   17. CONTACT ACTIONS
   ========================================================= */

function setupContactActions(profile = {}) {
    const phone = normalizePhone(profile.phone || "");
    const email = profile.email || "";

    const whatsapp =
        document.getElementById("whatsapp-button");

    if (whatsapp && phone) {
        whatsapp.href =
            `https://wa.me/${phone}?text=Hello%20Muhammad,%20I%20would%20like%20to%20discuss%20a%20project.`;
    }

    const contactButton =
        document.querySelector(
            '.hero-buttons .btn-outline'
        );

    if (contactButton && email) {
        contactButton.href =
            `mailto:${email}?subject=Portfolio%20Inquiry`;
    }

    const contactCTA =
        document.querySelector(
            '#contact .btn-primary'
        );

    if (contactCTA && email) {
        contactCTA.href =
            `mailto:${email}?subject=Project%20Inquiry`;
        contactCTA.removeAttribute("target");
        contactCTA.removeAttribute("rel");
    }
}

/* =========================================================
   INIT
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    loadData
);
