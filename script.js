// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollAnimations();
    initTabs();
    initForms();
    initModal();
    initMobileMenu();
});

// 导航栏功能
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // 滚动时改变导航栏样式
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 平滑滚动到目标区域
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // 更新活动状态
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 滚动时更新活动链接
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// 滚动动画
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animateElements = document.querySelectorAll('.feature-card, .supply-card, .discount-card, .summary-card, .note-card, .value-card, .process-card, .hero-feature-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Tab切换功能
function initTabs() {
    const tabLinks = document.querySelectorAll('.dashboard-nav .nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabId = this.getAttribute('data-tab');

            // 更新活动状态
            tabLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // 显示对应内容
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// 表单功能
function initForms() {
    // 挂牌表单提交
    const sellForm = document.querySelector('.sell-form');
    if (sellForm) {
        sellForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('挂牌成功！您的酸枣已上架，等待企业采购。', 'success');
            this.reset();
        });
    }

    // 文件上传预览
    const uploadAreas = document.querySelectorAll('.upload-area');
    uploadAreas.forEach(area => {
        const fileInput = area.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.addEventListener('change', function(e) {
                const files = e.target.files;
                if (files.length > 0) {
                    showNotification(`已选择 ${files.length} 张照片`, 'info');
                }
            });
        }
    });

    // 拖拽上传
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--primary-color)';
            this.style.background = 'rgba(139, 69, 19, 0.05)';
        });

        area.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dee2e6';
            this.style.background = 'transparent';
        });

        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = '#dee2e6';
            this.style.background = 'transparent';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                showNotification(`已拖入 ${files.length} 张照片`, 'info');
            }
        });
    });
}

// 模态框功能
function initModal() {
    const modal = document.getElementById('orderModal');

    // 点击外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // ESC键关闭
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 打开模态框
function openModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// 查看详情
function viewDetails(btn) {
    const card = btn.closest('.supply-card');
    const productName = card.querySelector('h3').textContent;

    showNotification(`正在查看 ${productName} 的详细信息`, 'info');
}

// 下单
function placeOrder(btn) {
    const card = btn.closest('.supply-card');
    const productName = card.querySelector('h3').textContent;
    const price = card.querySelector('.price').textContent;
    const supplier = card.querySelector('.supply-details p:last-child').textContent;

    // 更新模态框内容
    const modal = document.getElementById('orderModal');
    modal.querySelector('.product-summary h4').textContent = productName;
    modal.querySelector('.product-summary p:first-of-type').textContent = supplier;
    modal.querySelector('.product-summary p:last-of-type').textContent = `单价：${price}`;

    openModal();
}

// 确认订单
function confirmOrder() {
    showNotification('订单已提交成功！我们将尽快与您联系确认详情。', 'success');
    closeModal();
}

// 移动端菜单
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navAuth = document.querySelector('.nav-auth');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navAuth.classList.toggle('active');

            // 汉堡菜单动画
            const bars = this.querySelectorAll('.bar');
            bars[0].classList.toggle('rotate-down');
            bars[1].classList.toggle('fade-out');
            bars[2].classList.toggle('rotate-up');
        });
    }
}

// 通知功能
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        z-index: 3000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        max-width: 400px;
        border-left: 4px solid ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;

    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
    `;

    const icon = notification.querySelector('.notification-content i');
    icon.style.cssText = `
        font-size: 1.2rem;
        color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
    `;

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        color: #6c757d;
    `;

    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // 自动关闭
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// 滚动到指定区域
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
    .animate-fadeInUp {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }

    .hamburger .bar.rotate-down {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .hamburger .bar.fade-out {
        opacity: 0;
    }

    .hamburger .bar.rotate-up {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// 添加平滑滚动到所有锚点链接
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    // Tab键导航时显示焦点
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
});

// 添加焦点样式
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid var(--primary-color) !important;
        outline-offset: 2px !important;
    }
`;
document.head.appendChild(focusStyle);

// 性能优化：防抖函数
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

// 优化滚动事件
const optimizedScrollHandler = debounce(function() {
    // 滚动时的其他操作
}, 16);

window.addEventListener('scroll', optimizedScrollHandler);

// 添加页面加载动画
window.addEventListener('load', function() {
    document.body.classList.add('loaded');

    // 延迟显示内容，增加加载感
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.opacity = '1';
        }
    }, 300);
});

// 添加页面加载样式
const loadStyle = document.createElement('style');
loadStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    body.loaded {
        opacity: 1;
    }

    .hero-content {
        opacity: 0;
        transition: opacity 0.8s ease;
    }
`;
document.head.appendChild(loadStyle);

console.log('邢台酸枣汁交易平台已加载完成！');
