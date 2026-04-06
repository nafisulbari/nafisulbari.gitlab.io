document.addEventListener('DOMContentLoaded', () => {
            const mainHeader = document.getElementById('main-header');
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const fullScreenMenu = document.getElementById('full-screen-menu');
            const menuCloseBtn = document.getElementById('menu-close-btn');
            const menuLinks = document.querySelectorAll('#full-screen-menu a');
            const scrollToTopBtn = document.getElementById('scroll-to-top');
            function adjustScrollButton() {
                const footerRect = footer.getBoundingClientRect();
                const btnRect = scrollToTopBtn.getBoundingClientRect();
                const windowHeight = window.innerHeight;

                // If the button would overlap the footer, move it up
                if (footerRect.top < windowHeight - btnRect.height - 20) {
                    // Move button up so it's above the footer
                    scrollToTopBtn.style.bottom = (windowHeight - footerRect.top + 20) + 'px';
                } else {
                    // Default position
                    scrollToTopBtn.style.bottom = '20px';
                }
            }
            window.addEventListener('scroll', adjustScrollButton);
            window.addEventListener('resize', adjustScrollButton);
            const footer = document.querySelector('footer');
            const progressBar = document.getElementById('progress-bar');
            const statusContainer = document.getElementById('status-container');


            const seasonImages = {
                season1: [
                    { src: '/image/season1webp/02.webp', alt: '' },
                    { src: '/image/season1webp/03.webp', alt: '' },
                    { src: '/image/season1webp/04.webp', alt: '' },
                    { src: '/image/season1webp/05.webp', alt: '' },
                    { src: '/image/season1webp/06.webp', alt: '' },
                    { src: '/image/season1webp/07.webp', alt: '' },
                    { src: '/image/season1webp/08.webp', alt: '' },
                    { src: '/image/season1webp/09.webp', alt: '' },
                    { src: '/image/season1webp/10.webp', alt: '' },
                    { src: '/image/season1webp/11.webp', alt: '' },
                    { src: '/image/season1webp/12.webp', alt: '' },
                    { src: '/image/season1webp/13.webp', alt: '' },
                    { src: '/image/season1webp/14.webp', alt: '' },
                    { src: '/image/season1webp/15.webp', alt: '' },
                    { src: '/image/season1webp/16.webp', alt: '' },
                    { src: '/image/season1webp/17.webp', alt: '' },
                    { src: '/image/season1webp/18.webp', alt: '' },
                    { src: '/image/season1webp/19.webp', alt: '' },
                    { src: '/image/season1webp/20.webp', alt: '' },
                    { src: '/image/season1webp/21.webp', alt: '' },
                ],
                season2: [
                    { src: '/image/season2webp/01.webp', alt: '' },
                    { src: '/image/season2webp/02.webp', alt: '' },
                    { src: '/image/season2webp/03.webp', alt: '' },
                    { src: '/image/season2webp/04.webp', alt: '' },
                    { src: '/image/season2webp/05.webp', alt: '' },
                    { src: '/image/season2webp/06.webp', alt: '' },
                    { src: '/image/season2webp/07.webp', alt: '' },
                    { src: '/image/season2webp/08.webp', alt: '' },
                ]
            };

            // Lazy loading with blur placeholder
            const createLazyImage = (src, alt, className = '') => {
                const img = document.createElement('img');
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
                img.alt = alt;
                img.className = `lazy-image lazy-image-placeholder ${className}`;
                img.loading = 'lazy';
                img.decoding = 'async';

                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const targetImg = entry.target;
                            const realImg = new Image();
                            realImg.onload = () => {
                                targetImg.src = src;
                                targetImg.classList.add('loaded');
                                targetImg.classList.remove('lazy-image-placeholder');
                            };
                            realImg.src = src;
                            observer.unobserve(targetImg);
                        }
                    });
                }, { rootMargin: '50px' });

                observer.observe(img);
                return img;
            };

            // Preload critical images only
            const preloadCriticalImages = (urls) => {
                const criticalUrls = urls.slice(0, 5); // Only first 5 images
                return Promise.all(criticalUrls.map((url) => new Promise((resolve) => {
                    const img = new Image();
                    img.decoding = 'sync';
                    img.loading = 'eager';
                    img.onload = img.onerror = () => resolve(url);
                    img.src = url;
                })));
            };

            const gallery1 = document.getElementById('gallery-1');
            const gallery2 = document.getElementById('gallery-2');
            const modal = document.getElementById('image-modal');
            const modalImage = document.getElementById('modal-image');
            const closeModalBtn = document.getElementById('close-modal-btn');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const season1Btn = document.getElementById('season1-btn');
            const season2Btn = document.getElementById('season2-btn');

            let currentIndex = 0;
            let currentSeason = 'season1';

            const renderGallery = (season) => {
                gallery1.innerHTML = '';
                gallery2.innerHTML = '';
                const images = seasonImages[season] || [];

                const renderImages = (container) => {
                    [...images, ...images].forEach((image, index) => { // Duplicate for seamless scroll
                        const imgElement = createLazyImage(image.src, image.alt, 'gallery-image');
                        imgElement.dataset.index = index;
                        container.appendChild(imgElement);
                    });
                };

                renderImages(gallery1);
                renderImages(gallery2);
            };

            renderGallery('season1');
            season1Btn.classList.add('active');
            season2Btn.classList.remove('active');

            // Preload only critical images
            const galleryUrls = Object.values(seasonImages).flat().map(i => i.src);
            preloadCriticalImages(galleryUrls);

            // Register a simple service worker for image/video caching
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js').catch(() => {});
            }

            const showImage = (index) => {
                const images = seasonImages[currentSeason] || [];
                if (index >= 0 && index < images.length) {
                    currentIndex = index;
                    modalImage.src = images[currentIndex].src;
                    modalImage.alt = images[currentIndex].alt;
                    modal.classList.add('is-active');
                    modal.classList.remove('hidden');
                    document.body.classList.add('modal-open');
                }
            };

            const hideImage = () => {
                modal.classList.add('hidden');
                modal.classList.remove('is-active');
                document.body.classList.remove('modal-open');
            };

            document.addEventListener('click', (e) => {
                const clickedImg = e.target.closest('.gallery-image');
                if (clickedImg) {
                    const index = parseInt(clickedImg.dataset.index, 10);
                    showImage(index);
                }
            });

            closeModalBtn.addEventListener('click', hideImage);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    hideImage();
                }
            });

            const showPreviousImage = () => {
                const images = seasonImages[currentSeason] || [];
                let prevIndex = currentIndex - 1;
                if (prevIndex < 0) {
                    prevIndex = images.length - 1;
                }
                showImage(prevIndex);
            };

            const showNextImage = () => {
                const images = seasonImages[currentSeason] || [];
                let nextIndex = currentIndex + 1;
                if (nextIndex >= images.length) {
                    nextIndex = 0;
                }
                showImage(nextIndex);
            };

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showPreviousImage();
            });

            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showNextImage();
            });

            document.addEventListener('keydown', (e) => {
                if (!modal.classList.contains('hidden')) {
                    if (e.key === 'ArrowLeft') {
                        showPreviousImage();
                    } else if (e.key === 'ArrowRight') {
                        showNextImage();
                    } else if (e.key === 'Escape') {
                        hideImage();
                    }
                }
            });

            season1Btn.addEventListener('click', () => {
                currentSeason = 'season1';
                renderGallery(currentSeason);
                season1Btn.classList.add('active');
                season2Btn.classList.remove('active');
            });

            season2Btn.addEventListener('click', () => {
                currentSeason = 'season2';
                renderGallery(currentSeason);
                season2Btn.classList.add('active');
                season1Btn.classList.remove('active');
            });

            const lenis = new Lenis()
            const heroBackground = document.getElementById('hero-bg');
            const heroContent = document.querySelector('.hero-content');

            let lastScrollPos = 0;
            lenis.on('scroll', (e) => {
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${e.scroll * 0.5}px) translateZ(0)`;
                }
                if (e.scroll > 50) {
                    mainHeader.classList.add('py-2', 'bg-black/50', 'backdrop-blur-sm');
                    mainHeader.classList.remove('py-12');
                } else {
                    mainHeader.classList.remove('py-2', 'bg-black/50', 'backdrop-blur-sm');
                    mainHeader.classList.add('py-12');
                }

                if (e.scroll > 400) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
                const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollProgress = (e.scroll / totalHeight) * 100;
                progressBar.style.height = scrollProgress + '%';
                const revealElements = document.querySelectorAll('.reveal-element');
                const viewportHeight = window.innerHeight;
                const elementVisible = 150;
                revealElements.forEach(element => {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top;
                    if (elementTop < viewportHeight - elementVisible) {
                        element.classList.add('is-visible');
                        // Save revealed state to localStorage
                        const elementId = element.id || element.className + '_' + Array.from(revealElements).indexOf(element);
                        localStorage.setItem(`revealed_${elementId}`, 'true');
                    }
                });
            })

            function raf(time) {
                lenis.raf(time)
                requestAnimationFrame(raf)
            }
            requestAnimationFrame(raf)

            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    lenis.scrollTo(this.getAttribute('href'));
                });
            });

            scrollToTopBtn.addEventListener('click', () => {
                if (typeof lenis?.scrollTo === 'function') {
                    lenis.scrollTo(0, { duration: 1.1 });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });

            const openMenu = () => {
                fullScreenMenu.classList.add('open');
                document.body.style.overflow = 'hidden';
            };
            const closeMenu = () => {
                fullScreenMenu.classList.remove('open');
                document.body.style.overflow = '';
            };
            hamburgerBtn.addEventListener('click', openMenu);
            menuCloseBtn.addEventListener('click', closeMenu);
            menuLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });

            // Theme toggle (guard if the control isn't present)
            const themeToggleInput = document.querySelector('.switch .input');
            const storedTheme = localStorage.getItem('theme') || 'dark-theme';
            document.body.className = storedTheme;
            if (themeToggleInput) {
                if (storedTheme === 'light-theme') {
                    themeToggleInput.checked = true;
                }
                themeToggleInput.addEventListener('change', (e) => {
                    if (e.target.checked) {
                        document.body.classList.remove('dark-theme');
                        document.body.classList.add('light-theme');
                        localStorage.setItem('theme', 'light-theme');
                    } else {
                        document.body.classList.remove('light-theme');
                        document.body.classList.add('dark-theme');
                        localStorage.setItem('theme', 'dark-theme');
                    }
                });
            }

            // Restore previously revealed elements on page load
            const restoreRevealedElements = () => {
                const revealElements = document.querySelectorAll('.reveal-element');
                revealElements.forEach(element => {
                    const elementId = element.id || element.className + '_' + Array.from(revealElements).indexOf(element);
                    if (localStorage.getItem(`revealed_${elementId}`) === 'true') {
                        element.classList.add('is-visible');
                    }
                });
            };


//            function updateScrollSpeed() {
//                      const galleryWrapper = document.querySelector('.image-gallery-wrapper');
//                      if (!galleryWrapper) return;
//
//                      const wrapperWidth = galleryWrapper.scrollWidth;
//                      const pixelsPerSecond = 2000; // Speed Adujster
//                      const duration = wrapperWidth / pixelsPerSecond;
//
//                      galleryWrapper.style.animationDuration = ${duration}s;
//            }




            renderGallery(currentSeason);
            restoreRevealedElements();
//            updateScrollSpeed();
//            window.addEventListener('resize', updateScrollSpeed);

        });