/**
 * 紫金设计网站 - 主要功能脚本
 * 包含轮播图、导航交互、动画效果等功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initBannerSlider();
    initNavigation();
    initScrollAnimations();
    initServiceCards();
    initCaseNavigation();
});

/**
 * 轮播图功能
 */
function initBannerSlider() {
    const slides = document.querySelectorAll('.banner-slide');
    const prevBtn = document.querySelector('.banner-btn-prev');
    const nextBtn = document.querySelector('.banner-btn-next');
    let currentSlide = 0;
    let slideInterval;

    // 如果没有幻灯片，返回
    if (!slides.length) return;

    // 创建轮播控制按钮（如果不存在）
    createBannerControls();

    // 显示指定幻灯片
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        
        // 重置当前幻灯片的动画
        const title = slides[currentSlide].querySelector('.banner-title');
        const subtitle = slides[currentSlide].querySelector('.banner-subtitle');
        if (title && subtitle) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            subtitle.style.opacity = '0';
            subtitle.style.transform = 'translateY(30px)';
            
            // 触发重排以重置动画
            title.offsetHeight;
            subtitle.offsetHeight;
            
            // 开始动画
            setTimeout(() => {
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // 下一张幻灯片
    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    // 上一张幻灯片
    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // 自动播放
    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // 停止自动播放
    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // 创建控制按钮
    function createBannerControls() {
        const bannerSection = document.querySelector('.banner-section');
        if (!bannerSection) return;

        let controls = bannerSection.querySelector('.banner-controls');
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'banner-controls';
            controls.innerHTML = `
                <button class="banner-btn banner-btn-prev">‹</button>
                <button class="banner-btn banner-btn-next">›</button>
            `;
            bannerSection.appendChild(controls);
        }

        // 重新获取按钮引用
        const newPrevBtn = controls.querySelector('.banner-btn-prev');
        const newNextBtn = controls.querySelector('.banner-btn-next');

        // 绑定事件
        if (newPrevBtn) {
            newPrevBtn.addEventListener('click', () => {
                stopAutoPlay();
                prevSlide();
                startAutoPlay();
            });
        }

        if (newNextBtn) {
            newNextBtn.addEventListener('click', () => {
                stopAutoPlay();
                nextSlide();
                startAutoPlay();
            });
        }
    }

    // 绑定键盘事件
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            stopAutoPlay();
            prevSlide();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            stopAutoPlay();
            nextSlide();
            startAutoPlay();
        }
    });

    // 鼠标悬停时停止自动播放
    const bannerSection = document.querySelector('.banner-section');
    if (bannerSection) {
        bannerSection.addEventListener('mouseenter', stopAutoPlay);
        bannerSection.addEventListener('mouseleave', startAutoPlay);
    }

    // 初始化第一张幻灯片
    showSlide(0);
    startAutoPlay();
}

/**
 * 导航菜单功能
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const navUnderline = document.querySelector('.nav-underline');
    
    if (!navItems.length || !navUnderline) return;

    // 为每个导航项添加悬停效果
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function() {
            // 移动下划线
            const itemRect = this.getBoundingClientRect();
            const navRect = this.parentElement.getBoundingClientRect();
            const left = itemRect.left - navRect.left;
            
            navUnderline.style.left = left + 'px';
            navUnderline.style.width = itemRect.width + 'px';
        });

        item.addEventListener('click', function() {
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');
            
            // 更新下划线位置
            const itemRect = this.getBoundingClientRect();
            const navRect = this.parentElement.getBoundingClientRect();
            const left = itemRect.left - navRect.left;
            
            navUnderline.style.left = left + 'px';
            navUnderline.style.width = itemRect.width + 'px';
        });
    });

    // 鼠标离开导航区域时重置下划线位置
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('mouseleave', function() {
            const activeItem = document.querySelector('.nav-item.active');
            if (activeItem) {
                const itemRect = activeItem.getBoundingClientRect();
                const navRect = activeItem.parentElement.getBoundingClientRect();
                const left = itemRect.left - navRect.left;
                
                navUnderline.style.left = left + 'px';
                navUnderline.style.width = itemRect.width + 'px';
            }
        });
    }
}

/**
 * 滚动动画效果
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.service-card, .industry-item, .case-item, .partner-logo');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // 统计数字动画
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const unit = number.querySelector('.stat-unit')?.textContent || '';
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                number.innerHTML = Math.floor(current) + '<span class="stat-unit">' + unit + '</span>';
            }, 30);
        });
    }

    // 观察统计数字区域
    const statBoxes = document.querySelectorAll('.stat-box');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 移除loading状态
                entry.target.classList.remove('loading');
                entry.target.classList.add('animated');
                
                // 触发数字动画
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    setTimeout(() => {
                        statNumber.classList.add('animated');
                        animateNumbers();
                    }, 200);
                }
            }
        });
    }, { threshold: 0.5 });

    statBoxes.forEach(box => {
        statObserver.observe(box);
    });
}

/**
 * 服务卡片交互
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 案例导航功能
 */
function initCaseNavigation() {
    const caseNavItems = document.querySelectorAll('.cases-nav-item');
    const caseItems = document.querySelectorAll('.case-item');
    
    if (!caseNavItems.length) return;

    caseNavItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            caseNavItems.forEach(nav => nav.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');
            
            // 这里可以添加筛选案例的逻辑
            const category = this.textContent.trim();
            filterCases(category);
        });
    });
}

/**
 * 案例筛选功能
 */
function filterCases(category) {
    const caseItems = document.querySelectorAll('.case-item');
    
    caseItems.forEach(item => {
        if (category === '首页' || category === '全部') {
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 100);
        } else {
            // 这里可以根据实际案例的分类进行筛选
            // 暂时显示所有案例
            item.style.display = 'block';
            item.style.opacity = '0';
            setTimeout(() => {
                item.style.opacity = '1';
            }, 100);
        }
    });
}

/**
 * 工具函数：平滑滚动
 */
function smoothScrollTo(element, duration = 800) {
    const targetPosition = element.offsetTop;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 添加一些实用的全局函数
window.zijinDesign = {
    smoothScrollTo,
    debounce,
    throttle,
    filterCases
};