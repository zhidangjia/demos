/**
 * 紫金设计网站 - 主要功能脚本
 * 包含轮播图、导航交互、动画效果等功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 初始化所有功能
    initBannerSlider();
    // initNavigation();
    initScrollAnimations();
    initServiceCards();
    initCaseNavigation();
    initGlobalActiveNav();
    initGlobalFooter();
    initDetailImageZoom();
    initFlowAnimation();
    setDetailPaddingTop();
});

/**
 * 轮播图功能
 */
/**
 * 功能: 初始化首页横幅轮播，支持自动播放与左右切换
 * 输入: 无（从文档中查询 `.banner-slide`、控制按钮容器）
 * 输出: 无（直接更新DOM类名与事件绑定）
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
            // title.style.transform = 'translateY(30px)';
            subtitle.style.opacity = '0';
            // subtitle.style.transform = 'translateY(30px)';

            // 触发重排以重置动画
            title.offsetHeight;
            subtitle.offsetHeight;

            // 开始动画
            setTimeout(() => {
                title.style.opacity = '1';
                // title.style.transform = 'translateY(0)';
                subtitle.style.opacity = '1';
                // subtitle.style.transform = 'translateY(0)';
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
    document.addEventListener('keydown', function (e) {
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
/**
 * 功能: 顶部导航交互，下划线随悬停/点击移动
 * 输入: 无（读取 `.nav-item` 与 `.nav-underline`）
 * 输出: 无（更新导航项的 active 状态与下划线位置）
 */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const navUnderline = document.querySelector('.nav-underline');

    if (!navItems.length || !navUnderline) return;

    const defaultActive = document.querySelector('.nav-item.active');
    if (defaultActive) {
        defaultActive.dataset.clicked = 'true';
    }

    // 为每个导航项添加悬停效果
    navItems.forEach((item, index) => {
        item.addEventListener('mouseenter', function () {
            // 移动下划线
            const itemRect = this.getBoundingClientRect();
            const navRect = this.parentElement.getBoundingClientRect();
            const left = itemRect.left - navRect.left;

            navUnderline.style.left = left + 'px';
            navUnderline.style.width = itemRect.width + 'px';

            navItems.forEach(nav => nav.classList.remove('active'));
        });

        item.addEventListener('mouseleave', function () {
            const clickedActive = Array.from(navItems).find(nav => nav.dataset.clicked === 'true');
            if (clickedActive) {
                navItems.forEach(nav => nav.classList.remove('active'));
                clickedActive.classList.add('active');

                const itemRect = clickedActive.getBoundingClientRect();
                const navRect = clickedActive.parentElement.getBoundingClientRect();
                const left = itemRect.left - navRect.left;
                navUnderline.style.left = left + 'px';
                navUnderline.style.width = itemRect.width + 'px';
            }
        });

        item.addEventListener('click', function () {
            // 移除所有active类
            navItems.forEach(nav => nav.classList.remove('active'));
            // 添加active类到当前项
            this.classList.add('active');
            navItems.forEach(nav => { delete nav.dataset.clicked; });
            this.dataset.clicked = 'true';

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
        navMenu.addEventListener('mouseleave', function () {
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
 * 全站当前导航自动高亮
 * 来源优先级：<meta name="nav-current" content="primary|secondary"> > 路径映射 > URL 查询
 */
/**
 * 功能: 全站导航高亮，根据 meta、路径或查询参数激活一级/二级导航
 * 输入: 无（从 `<meta name="nav-current">` 与 `location.pathname` 获取信息）
 * 输出: 无（为匹配的导航元素添加 `active` 与 `aria-current`）
 */
function initGlobalActiveNav() {
    try {
        var meta = document.querySelector('meta[name="nav-current"]');
        var primary = null, secondary = null;
        if (meta && meta.content) {
            var parts = meta.content.split('|');
            primary = (parts[0] || '').trim() || null;
            secondary = (parts[1] || '').trim() || null;
        }
        if (!primary) {
            var path = location.pathname || '/';
            var map = {
                '/': { primary: 'home' },
                '/index.html': { primary: 'home' },
                '/cases/last_updated.html': { primary: 'cases', secondary: 'last_updated' },
                '/cases/logo-design.html': { primary: 'cases', secondary: 'brand' }
            };
            var m = map[path];
            if (m) { primary = m.primary; secondary = m.secondary || null; }
        }
        // 应用一级导航激活
        if (primary) {
            var navLinks = document.querySelectorAll('.nav-menu .nav-item');
            navLinks.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
            var target = document.querySelector('.nav-menu .nav-item[data-key="' + primary + '"]');
            if (target) { target.classList.add('active'); target.setAttribute('aria-current', 'page'); }
        }
        // 应用二级导航激活（tags 容器）
        if (secondary) {
            var tagLinks = document.querySelectorAll('.tags-container-cases .tag-item');
            tagLinks.forEach(function (a) { a.classList.remove('active'); a.removeAttribute('aria-current'); });
            var tag = document.querySelector('.tags-container-cases .tag-item[data-key="' + secondary + '"]');
            if (tag) { tag.classList.add('active'); tag.setAttribute('aria-current', 'page'); }
        }
    } catch (e) { /* noop */ }
}

/**
 * 功能: 异步加载页脚片段，按多个相对路径尝试
 * 输入: 无（内部维护待尝试路径数组）
 * 输出: 无（成功后替换 `.footer-section` 节点）
 */
function initGlobalFooter() {
    var el = document.querySelector('.footer-section');
    if (!el) return;
    var paths = ['/partials/footer.html', '../partials/footer.html', './partials/footer.html'];
    var i = 0;
    function next() {
        if (i >= paths.length) return;
        fetch(paths[i]).then(function (r) {
            if (!r.ok) throw new Error('');
            return r.text();
        }).then(function (html) {
            el.outerHTML = html;
        }).catch(function () {
            i++;
            next();
        });
    }
    next();
}

/**
 * 滚动动画效果
 */
/**
 * 功能: 滚动进入视口时添加动画类，并在统计区触发数字递增动画
 * 输入: 无（观察页面上特定选择器的元素）
 * 输出: 无（通过类名和定时器更新样式/文本）
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
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
    const statObserver = new IntersectionObserver(function (entries) {
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
/**
 * 功能: 服务卡片悬停轻微上移的交互效果
 * 输入: 无（选择 `.service-card` 列表）
 * 输出: 无（修改行内样式）
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * 案例导航功能
 */
/**
 * 功能: 案例导航标签交互，点击/悬停高亮并触发筛选
 * 输入: 无（读取 `.cases-nav-item` 文本作为分类）
 * 输出: 无（更新标签 active 状态并调用 `filterCases`）
 */
function initCaseNavigation() {
    const caseNavItems = document.querySelectorAll('.cases-nav-item');
    const caseItems = document.querySelectorAll('.case-item');

    if (!caseNavItems.length) return;

    // 动态设置下划线宽度
    function updateUnderlineWidth(element) {
        const textWidth = element.scrollWidth;
        element.style.setProperty('--underline-width', textWidth + 'px');
    }

    caseNavItems.forEach(item => {
        // 初始化下划线宽度
        updateUnderlineWidth(item);

        item.addEventListener('click', function () {
            // 移除所有active类和数据标记
            caseNavItems.forEach(nav => {
                nav.classList.remove('active');
                delete nav.dataset.clicked;
            });
            // 添加active类到当前项并标记为已点击
            this.classList.add('active');
            this.dataset.clicked = 'true';

            // 这里可以添加筛选案例的逻辑
            const category = this.textContent.trim();
            filterCases(category);
        });

        // 添加hover效果 - 鼠标进入时临时移除其他active状态
        item.addEventListener('mouseenter', function () {
            caseNavItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });

        // 鼠标离开时恢复原始的active状态
        item.addEventListener('mouseleave', function () {
            // 找到之前点击的active项并恢复
            const clickedActive = Array.from(caseNavItems).find(nav =>
                nav.dataset.clicked === 'true'
            );
            if (clickedActive) {
                caseNavItems.forEach(nav => nav.classList.remove('active'));
                clickedActive.classList.add('active');
            }
        });
    });
}

/**
 * 案例筛选功能
 */
/**
 * 功能: 案例筛选（当前为占位实现，统一淡入显示）
 * 输入: `category`: 字符串，导航项文本
 * 输出: 无（直接修改案例项显示与透明度）
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
/**
 * 功能: 平滑滚动到目标元素
 * 输入: `element`: 目标DOM元素；`duration`: 动画时长毫秒
 * 输出: 无（滚动窗口到指定位置）
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
/**
 * 功能: 防抖函数，延迟执行直到停止触发
 * 输入: `func`: 原函数；`wait`: 延迟毫秒
 * 输出: 返回封装后的新函数
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
/**
 * 功能: 节流函数，限制一定时间内的执行频率
 * 输入: `func`: 原函数；`limit`: 时间窗口毫秒
 * 输出: 返回封装后的新函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function () {
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

/* from brand design.html*/
/**
 * 功能: 行业案例数据渲染与筛选（时间/行业/子分类/排序），含尺寸同步与动画
 * 输入: `#industry-data` 中的 JSON 数据、用户在筛选面板中的交互
 * 输出: 更新 `#industry-grid` 的卡片列表、同步 URL 参数、绑定交互事件
 */
(function () {
    var grid = document.getElementById('industry-grid');
    var dataEl = document.getElementById('industry-data');
    if (!grid || !dataEl) return;
    var dataText = dataEl.textContent;
    var items = [];
    try { items = JSON.parse(dataText); } catch (e) { items = []; }
    function norm(s) { return (s || '').toString(); }
    items.forEach(function (i) { i.sortName = norm(i.name); });
    var taxonomy = (function () {
        var map = {}; items.forEach(function (i) { var ind = i.industry; if (!map[ind]) map[ind] = {}; (i.subIndustries || []).forEach(function (si) { map[ind][si] = true; }); });
        var res = {}; Object.keys(map).forEach(function (ind) { res[ind] = Object.keys(map[ind]); }); return res;
    })();
    var state = { start: null, end: null, industries: [], subs: [], sort: { by: 'none', order: 'asc' } };
    /**
     * 功能: 按时间、行业、子分类与排序生成列表并渲染
     * 输入: 读取全局 `state`
     * 输出: 调用 `renderAnimated(list)` 更新DOM，并同步URL
     */
    function applyFilters() {
        var list = items.slice();
        if (state.start) { list = list.filter(function (i) { return new Date(i.date) >= new Date(state.start); }); }
        if (state.end) { list = list.filter(function (i) { return new Date(i.date) <= new Date(state.end); }); }
        if (state.industries && state.industries.length) {
            list = list.filter(function (i) { return state.industries.indexOf(i.industry) > -1; });
        }
        if (state.subs && state.subs.length) {
            list = list.filter(function (i) { var subs = i.subIndustries || []; return state.subs.some(function (s) { return subs.indexOf(s) > -1; }); });
        }
        if (state.sort.by === 'date') { list.sort(function (a, b) { var da = new Date(a.date).getTime(), db = new Date(b.date).getTime(); return state.sort.order === 'asc' ? da - db : db - da; }); }
        else if (state.sort.by === 'name') { list.sort(function (a, b) { var c = a.sortName.localeCompare(b.sortName, 'zh'); return state.sort.order === 'asc' ? c : -c; }); }
        else { /* keep JSON order */ }
        renderAnimated(list);
        syncURL();
    }
    /**
     * 功能: 渲染并带淡入/淡出过渡动画
     * 输入: `list`: 过滤与排序后的项目数组
     * 输出: 更新 `#industry-grid` 子节点并附加动画类
     */
    function renderAnimated(list) {
        var grid = document.getElementById('industry-grid');
        if (!grid) { render(list); return; }
        var oldEls = Array.from(grid.children);
        if (oldEls.length) {
            oldEls.forEach(function (el) { el.classList.remove('card-fade-in'); el.classList.add('card-fade-out'); });
            setTimeout(function () {
                render(list);
                var newEls = Array.from(grid.children);
                newEls.forEach(function (el) {
                    el.classList.remove('card-fade-out');
                    el.classList.add('card-fade-in');
                    el.addEventListener('animationend', function () { el.classList.remove('card-fade-in'); }, { once: true });
                });
                animateMosaicOnGrid(720);
            }, 240);
        } else {
            render(list);
            var newEls = Array.from(grid.children);
            newEls.forEach(function (el) {
                el.classList.add('card-fade-in');
                el.addEventListener('animationend', function () { el.classList.remove('card-fade-in'); }, { once: true });
            });
            animateMosaicOnGrid(720);
        }
    }
    /**
     * 功能: 将项目数组渲染为卡片网格
     * 输入: `list`: 项目数组
     * 输出: 更新 `#industry-grid` 的 DOM 结构
     */
    function render(list) {
        var frag = document.createDocumentFragment();
        var navMeta = document.querySelector('meta[name="nav-current"]');
        var isSelfMedia = navMeta && typeof navMeta.content === 'string' && navMeta.content.indexOf('self_media') > -1;
        // 低空经济页面分组渲染：通过 meta[name="nav-current"] 标识 "ai|low_altitude" 进行页面判断
        var isLowAltitude = navMeta && typeof navMeta.content === 'string' && navMeta.content.indexOf('ai|low_altitude') > -1;
        // 记录上一条的行业名称，以在行业变化处插入分组标题，保持 JSON 原始顺序
        var lastIndustry = null;
        list.forEach(function (i) {
            // 当进入低空经济页面时：在每个行业组的起始位置插入分组标题
            // 标题样式由 .industry-group-title 控制（全宽、左对齐、上下留白）
            if (isLowAltitude) {
                if (i.industry !== lastIndustry) {
                    var title = document.createElement('div');
                    title.className = 'industry-group-title';
                    title.textContent = i.industry || '';
                    frag.appendChild(title);
                    lastIndustry = i.industry;
                }
            }
            var card = document.createElement('div'); card.className = 'industry-card';
            var wrap = document.createElement('div'); wrap.className = 'industry-item';
            if (isSelfMedia) { wrap.classList.add('self_media-industry-item'); }
            var dl = i['data-link'] || i.dataLink || '';
            wrap.dataset.link = dl ? dl : ('/cases/detail/' + encodeURIComponent((i.name || '').replace(/\./g, '')) + '.html');
            var img = document.createElement('img'); img.src = i.image; img.alt = i.name; img.loading = 'lazy';
            var cap = document.createElement('p'); cap.className = 'category-industry-caption'; cap.textContent = i.name;
            wrap.appendChild(img);
            card.appendChild(wrap);
            card.appendChild(cap);
            frag.appendChild(card);
        });
        grid.innerHTML = ''; grid.appendChild(frag);
        resizeTimeDropdown();
    }
    function animateMosaicOnGrid(duration) {
        var imgs = document.querySelectorAll('#industry-grid .industry-item img');
        imgs.forEach(function (img) { animateMosaicReveal(img, duration || 1000); });
    }
    function animateMosaicReveal(img, duration) {
        function start() {
            var rect = img.getBoundingClientRect();
            var w = Math.max(1, Math.floor(rect.width));
            var h = Math.max(1, Math.floor(rect.height));
            var canvas = document.createElement('canvas');
            canvas.width = w; canvas.height = h;
            canvas.style.position = 'absolute';
            canvas.style.left = '0';
            canvas.style.top = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '2';
            var ctx = canvas.getContext('2d');
            if (!ctx) return;
            var off = document.createElement('canvas');
            var offCtx = off.getContext('2d');
            if (!offCtx) return;
            offCtx.imageSmoothingEnabled = false;
            ctx.imageSmoothingEnabled = false;
            img.parentElement.style.position = 'relative';
            img.parentElement.appendChild(canvas);
            var t0 = performance.now();
            var startBlock = 32;
            function frame(now) {
                var p = Math.min(1, (now - t0) / (duration || 1000));
                var block = Math.max(1, Math.round(startBlock - p * (startBlock - 1)));
                var sw = Math.max(1, Math.floor(w / block));
                var sh = Math.max(1, Math.floor(h / block));
                off.width = sw; off.height = sh;
                offCtx.clearRect(0, 0, sw, sh);
                offCtx.drawImage(img, 0, 0, sw, sh);
                ctx.clearRect(0, 0, w, h);
                ctx.drawImage(off, 0, 0, sw, sh, 0, 0, w, h);
                if (p < 1) { requestAnimationFrame(frame); }
                else { if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas); }
            }
            requestAnimationFrame(frame);
        }
        if (img.complete && img.naturalWidth > 0) start();
        else img.addEventListener('load', start, { once: true });
    }
    /**
     * 功能: 将当前筛选/排序状态写入地址栏查询参数
     * 输入: 读取全局 `state`
     * 输出: 通过 `history.replaceState` 更新URL
     */
    function syncURL() {
        var params = new URLSearchParams();
        if (state.start) params.set('start', state.start);
        if (state.end) params.set('end', state.end);
        if (state.industries && state.industries.length) params.set('industries', state.industries.join(','));
        if (state.subs && state.subs.length) params.set('subs', state.subs.join(','));
        params.set('sort', state.sort.by + '_' + state.sort.order);
        var url = location.pathname + '?' + params.toString();
        history.replaceState(null, '', url);
    }
    /**
     * 功能: 从地址栏恢复筛选/排序状态
     * 输入: `location.search`
     * 输出: 更新 `state` 并赋值到日期输入
     */
    function initFromURL() {
        var qs = new URLSearchParams(location.search);
        var start = qs.get('start'); var end = qs.get('end'); var inds = qs.get('industries'); var subs = qs.get('subs'); var sort = qs.get('sort');
        if (start) { state.start = start; var sd = document.getElementById('start-date'); if (sd) sd.value = start; }
        if (end) { state.end = end; var ed = document.getElementById('end-date'); if (ed) ed.value = end; }
        if (inds) state.industries = inds.split(',').filter(Boolean);
        if (subs) state.subs = subs.split(',').filter(Boolean);
        if (sort) { var parts = sort.split('_'); if (parts[0]) state.sort.by = parts[0]; if (parts[1]) state.sort.order = parts[1]; }
    }
    /**
     * 功能: 构建行业复选列表，绑定即时过滤
     * 输入: `taxonomy`（行业->子分类 映射）
     * 输出: 填充 `#industry-list`，并触发子分类构建
     */
    function buildIndustry() {
        var indWrap = document.getElementById('industry-list'); var subWrap = document.getElementById('subindustry-list');
        indWrap.innerHTML = ''; subWrap.innerHTML = '';
        Object.keys(taxonomy).forEach(function (ind) {
            var lab = document.createElement('label'); lab.className = 'dropdown-check';
            var cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = ind; cb.checked = state.industries.indexOf(ind) > -1;
            cb.addEventListener('change', function () {
                var v = this.value;
                if (this.checked) { if (state.industries.indexOf(v) === -1) state.industries.push(v); }
                else { state.industries = state.industries.filter(function (x) { return x !== v; }); }
                state.subs = [];
                buildSubs(state.industries);
                applyFilters();
            });
            var span = document.createElement('span'); span.textContent = ind;
            lab.appendChild(cb); lab.appendChild(span);
            indWrap.appendChild(lab);
        });
        buildSubs(state.industries);
    }
    /**
     * 功能: 根据选中的行业集合，计算子分类并集并渲染复选
     * 输入: `inds`: 数组或单值行业标识
     * 输出: 填充 `#subindustry-list` 并绑定即时过滤
     */
    function buildSubs(inds) {
        var subWrap = document.getElementById('subindustry-list'); subWrap.innerHTML = '';
        var union = {};
        (Array.isArray(inds) ? inds : [inds]).filter(Boolean).forEach(function (ind) {
            (taxonomy[ind] || []).forEach(function (si) { union[si] = true; });
        });
        var keys = Object.keys(union);
        if (!keys.length) { return; }
        keys.forEach(function (si) {
            var lab = document.createElement('label'); lab.className = 'dropdown-check';
            var cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = si; cb.checked = state.subs.indexOf(si) > -1;
            cb.addEventListener('change', function () {
                var v = this.value;
                if (this.checked) { if (state.subs.indexOf(v) === -1) state.subs.push(v); }
                else { state.subs = state.subs.filter(function (x) { return x !== v; }); }
                applyFilters();
            });
            var span = document.createElement('span'); span.textContent = si;
            lab.appendChild(cb); lab.appendChild(span);
            subWrap.appendChild(lab);
        });
    }
    /**
     * 功能: 绑定筛选面板开关、排序按钮切换、网格点击跳转、外部点击关闭等事件
     * 输入: 无（读取DOM元素并绑定回调）
     * 输出: 无
     */
    function bindUI() {
        var btnTime = document.getElementById('btn-time'); var ddTime = document.getElementById('dropdown-time');
        var btnSort = document.getElementById('btn-sort'); var ddSort = document.getElementById('dropdown-sort');
        var btnInd = document.getElementById('btn-industry'); var ddInd = document.getElementById('dropdown-industry');
        function toggle(dd, btn) {
            var open = dd.classList.contains('show');
            [ddTime, ddSort, ddInd].forEach(function (x) { x.classList.remove('show'); });
            [btnTime, btnSort, btnInd].forEach(function (x) { x.classList.remove('active'); });
            if (!open) {
                dd.classList.add('show');
                btn.classList.add('active');
                resizeTimeDropdown();
                if (dd === ddTime) {
                    var sdEl = document.getElementById('start-date');
                    var edEl = document.getElementById('end-date');
                    var today = new Date();
                    var yyyy = today.getFullYear();
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var ddv = String(today.getDate()).padStart(2, '0');
                     var val = yyyy + '-' + mm + '-' + ddv;

                    if (sdEl && !sdEl.value) sdEl.value = val;
                    if (edEl && !edEl.value) edEl.value = val;
                }
            }
        }
        btnTime.addEventListener('click', function () { toggle(ddTime, btnTime); });
        btnSort.addEventListener('click', function () { toggle(ddSort, btnSort); });
        btnInd.addEventListener('click', function () { toggle(ddInd, btnInd); });
        document.getElementById('time-apply').addEventListener('click', function () { var sd = document.getElementById('start-date').value; var ed = document.getElementById('end-date').value; state.start = sd || null; state.end = ed || null; ddTime.classList.remove('show'); btnTime.classList.remove('active'); applyFilters(); });
        document.getElementById('time-clear').addEventListener('click', function () { state.start = null; state.end = null; document.getElementById('start-date').value = ''; document.getElementById('end-date').value = ''; applyFilters(); });
        var timeToggle = document.getElementById('sort-time-toggle');
        if (timeToggle) {
            timeToggle.addEventListener('click', function(){
                state.sort.by = 'date';
                var order = this.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
                this.setAttribute('data-order', order);
                state.sort.order = order;
                this.classList.remove('is-inactive');
                var other = document.getElementById('sort-name-toggle'); if (other) other.classList.add('is-inactive');
                applyFilters();
            });
        }
        var nameToggle = document.getElementById('sort-name-toggle');
        if (nameToggle) {
            nameToggle.addEventListener('click', function(){
                state.sort.by = 'name';
                var order = this.getAttribute('data-order') === 'asc' ? 'desc' : 'asc';
                this.setAttribute('data-order', order);
                state.sort.order = order;
                this.classList.remove('is-inactive');
                var other = document.getElementById('sort-time-toggle'); if (other) other.classList.add('is-inactive');
                applyFilters();
            });
        }
        function updateSortButtons(){
            var tt = document.getElementById('sort-time-toggle');
            var nt = document.getElementById('sort-name-toggle');
            if (!tt || !nt) return;
            if (state.sort.by === 'date') { tt.classList.remove('is-inactive'); nt.classList.add('is-inactive'); }
            else if (state.sort.by === 'name') { nt.classList.remove('is-inactive'); tt.classList.add('is-inactive'); }
            else { tt.classList.add('is-inactive'); nt.classList.add('is-inactive'); }
        }
        updateSortButtons();
        // 行业分类无需应用/清空按钮，复选项变更即生效
        document.addEventListener('click', function (e) { var t = e.target; if (!document.querySelector('.filter-bar').contains(t)) { [ddTime, ddSort, ddInd].forEach(function (x) { x.classList.remove('show'); });[btnTime, btnSort, btnInd].forEach(function (x) { x.classList.remove('active'); }); } });
        var gridEl = document.getElementById('industry-grid');
        if (gridEl) { gridEl.addEventListener('click', function (e) { var node = e.target.closest('.industry-item'); if (!node) return; var link = node.dataset.link || '#'; if (link && link !== '#') { window.open(link, '_blank'); } }); }
    }

    /**
     * 功能: 同步三个下拉面板尺寸到 `industry-grid` 宽度与第二行中线高度
     * 输入: 无（读取网格尺寸）
     * 输出: 为 `#dropdown-time/#dropdown-sort/#dropdown-industry` 设置 `width` 与 `min-height`
     */
    function resizeTimeDropdown() {
        var dd = document.getElementById('dropdown-time');
        var ddSort = document.getElementById('dropdown-sort');
        var ddInd = document.getElementById('dropdown-industry');
        var gridEl = document.getElementById('industry-grid');
        if (!gridEl) return;
        var w = gridEl.offsetWidth;
        if (dd) dd.style.width = w + 'px';
        if (ddSort) ddSort.style.width = w + 'px';
        if (ddInd) ddInd.style.width = w + 'px';
        var firstItem = gridEl.querySelector('.industry-item');
        if (!firstItem) return;
        var h = firstItem.getBoundingClientRect().height;
        var cs = getComputedStyle(gridEl);
        var rg = parseFloat(cs.rowGap || '0') || 0;
        var targetH = h + rg + h * 0.75;
        if (dd) dd.style.minHeight = Math.round(targetH) + 'px';
        if (ddSort) ddSort.style.minHeight = Math.round(targetH) + 'px';
        if (ddInd) ddInd.style.minHeight = Math.round(targetH) + 'px';
    }

    initFromURL();
    buildIndustry();
    bindUI();
    applyFilters();
    window.addEventListener('resize', resizeTimeDropdown);
})();

/**
 * 功能: 详情页图片点击大图预览（轻量灯箱）
 * 输入: 无（选择 `.detail-page img[data-zoom]`）
 * 输出: 无（创建/复用 `#image-lightbox` 并绑定点击/关闭事件）
 */
function initDetailImageZoom() {
    try {
        var images = document.querySelectorAll('.detail-page img[data-zoom]');
        if (!images.length) return;
        var box = document.getElementById('image-lightbox');
        if (!box) {
            box = document.createElement('div');
            box.id = 'image-lightbox';
            box.className = 'image-lightbox';
            var img = document.createElement('img');
            box.appendChild(img);
            document.body.appendChild(box);
            box.addEventListener('click', function () { box.classList.remove('active'); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('active'); });
        }
        images.forEach(function (el) {
            el.addEventListener('click', function () {
                var target = box.querySelector('img');
                target.src = this.src;
                target.alt = this.alt || '';
                box.classList.add('active');
            });
        });
    } catch (e) { /* noop */ }
}

/**
 * 功能: 基于设计宽度 1920 的响应缩放，设置 `--scale` 以及辅助高度撑开器
 * 输入: 无（读取窗口宽度与页面容器高度）
 * 输出: 更新 CSS 变量，处理移动端滚动区域，并回调副标题定位
 */
(function () {
    function updateScale() {
        var dw = 1920;
        var vw = document.documentElement.clientWidth;
        var scale = Math.min(vw / dw, 1);
        document.documentElement.style.setProperty('--scale', scale);
        var pc = document.querySelector('.page-container');
        var sizer = document.getElementById('mobile-sizer');
        if (!pc) return;
        if (scale < 1) {
            pc.classList.add('scaled');
            if (!sizer) { sizer = document.createElement('div'); sizer.id = 'mobile-sizer'; document.body.appendChild(sizer); }
            var scaledHeight = pc.scrollHeight * scale;
            sizer.style.height = scaledHeight + 'px';
        } else {
            pc.classList.remove('scaled');
            if (sizer && sizer.parentNode) { sizer.parentNode.removeChild(sizer); }
        }
        setDetailPaddingTop();
    }
    updateScale();
    if (window.__placeCasesSubtitle) window.__placeCasesSubtitle();
    window.addEventListener('resize', function () { updateScale(); if (window.__placeCasesSubtitle) window.__placeCasesSubtitle(); });
    window.addEventListener('orientationchange', function () { updateScale(); if (window.__placeCasesSubtitle) window.__placeCasesSubtitle(); });
})();

/**
 * 功能: 计算详情页顶部内边距，使内容在缩放后不被头部遮挡
 * 输入: 无（测量 `.site-header` 边界与 `--scale`）
 * 输出: 设置 `--detail-padding-top` CSS 变量
 */
function setDetailPaddingTop() {
    try {
        var header = document.querySelector('.site-header');
        if (!header) return;
        var rect = header.getBoundingClientRect();
        var scale = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--scale')) || 1;
        var designPx = Math.round(rect.bottom / Math.max(scale, 0.0001));
        document.documentElement.style.setProperty('--detail-padding-top', designPx + 'px');
    } catch (e) {}
}

function initFlowAnimation() {
    var flow = document.querySelector('.detail-flow .flow-row');
    if (!flow) return;
    var steps = flow.querySelectorAll('.flow-step');
    var arrows = flow.querySelectorAll('.flow-arrow');
    if (!steps.length || !arrows.length) return;
    var i = 0;
    var running = false;
    function tick() {
        arrows.forEach(function (a) { a.classList.remove('is-active'); });
        steps.forEach(function (s) { s.classList.remove('is-highlight'); });
        var idx = i % arrows.length;
        function runArrow() {
            arrows[idx].classList.add('is-active');
            setTimeout(function () {
                var target = steps[idx + 1];
                if (target) {
                    target.classList.add('is-highlight');
                    setTimeout(function () { target.classList.remove('is-highlight'); }, 600);
                }
            }, 400);
        }
        if (idx === 0 && steps[0]) {
            steps[0].classList.add('is-highlight');
            setTimeout(function () { steps[0].classList.remove('is-highlight'); }, 600);
            setTimeout(runArrow, 300);
        } else {
            runArrow();
        }
        i++;
    }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !running) {
                running = true;
                steps[0].classList.add('is-highlight');
                setTimeout(function () { steps[0].classList.remove('is-highlight'); }, 600);
                setTimeout(function () {
                    tick();
                    flow.__timer = setInterval(tick, 1200);
                }, 900);
            } else if (!entry.isIntersecting && running) {
                running = false;
                arrows.forEach(function (a) { a.classList.remove('is-active'); });
                steps.forEach(function (s) { s.classList.remove('is-highlight'); });
                if (flow.__timer) { clearInterval(flow.__timer); flow.__timer = null; }
            }
        });
    }, { threshold: 0.2 });
    io.observe(flow);
}
