/* #region Theme Toggle */
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeIcon = document.querySelector('.theme-toggle i');
    
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
        body.removeAttribute('data-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
}
/* #endregion */

/* #region Smooth Scrolling Navigation */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    const navHeight = document.querySelector('.navbar').offsetHeight;
    const targetPosition = section.offsetTop - navHeight;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Add smooth scrolling to all navigation links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});
/* #endregion */

/* #region Menu Filter System */
function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item-wrapper');
    const buttons = document.querySelectorAll('.filter-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Filter items
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
            item.classList.add('fade-in');
        } else {
            item.style.display = 'none';
        }
    });
}
/* #endregion */

/* #region Search Functionality */
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const items = document.querySelectorAll('.menu-item-wrapper');
            
            items.forEach(item => {
                const title = item.querySelector('h4').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});
/* #endregion */

/* #region Order Management System */
let orderItems = [];
let orderTotal = 0;

function updateQuantity(button, change) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    let quantity = parseInt(quantitySpan.textContent);
    quantity = Math.max(0, quantity + change);
    quantitySpan.textContent = quantity;
}

function addToOrder(itemName, price, button) {
    const quantitySpan = button.parentElement.querySelector('.quantity');
    const quantity = parseInt(quantitySpan.textContent);
    
    if (quantity > 0) {
        const existingItem = orderItems.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += quantity;
            existingItem.total = existingItem.quantity * price;
        } else {
            orderItems.push({
                name: itemName,
                price: price,
                quantity: quantity,
                total: quantity * price
            });
        }
        
        updateOrderDisplay();
        quantitySpan.textContent = '0';
        showNotification(`${itemName} added to order!`, 'success');
    } else {
        showNotification('Please select a quantity first', 'warning');
    }
}

function updateOrderDisplay() {
    const orderSection = document.getElementById('orderSection');
    const orderItemsDiv = document.getElementById('orderItems');
    const orderTotalDiv = document.getElementById('orderTotal');
    
    if (orderItems.length > 0) {
        orderSection.style.display = 'block';
        orderSection.classList.add('active');
        
        orderItemsDiv.innerHTML = orderItems.map(item => `
            <div class="order-item d-flex justify-content-between align-items-center mb-2">
                <div>
                    <strong>${item.name}</strong>
                    <span class="text-muted"> x ${item.quantity}</span>
                </div>
                <div class="d-flex align-items-center">
                    <span class="me-3">$${item.total.toFixed(2)}</span>
                    <button class="btn btn-sm btn-danger" onclick="removeFromOrder('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        orderTotal = orderItems.reduce((sum, item) => sum + item.total, 0);
        orderTotalDiv.querySelector('h4').textContent = `Total: $${orderTotal.toFixed(2)}`;
    } else {
        orderSection.style.display = 'none';
        orderSection.classList.remove('active');
    }
}

function removeFromOrder(itemName) {
    orderItems = orderItems.filter(item => item.name !== itemName);
    updateOrderDisplay();
    showNotification(`${itemName} removed from order`, 'info');
}

function submitOrder() {
    if (orderItems.length > 0) {
        const orderSummary = orderItems.map(item => 
            `${item.name} x${item.quantity} - $${item.total.toFixed(2)}`
        ).join('\n');
        
        showNotification(
            `Order submitted successfully!\n\nOrder Summary:\n${orderSummary}\n\nTotal: $${orderTotal.toFixed(2)}\n\nWe'll prepare your order shortly.`, 
            'success'
        );
        
        // Reset order
        orderItems = [];
        updateOrderDisplay();
    } else {
        showNotification('Your order is empty!', 'warning');
    }
}
/* #endregion */

/* #region Form Handling */
document.addEventListener('DOMContentLoaded', function() {
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;
            
            if (validateEmail(email)) {
                showNotification(`Thank you ${name}! Your message has been sent. We'll get back to you soon.`, 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }

    // Newsletter form handling
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('newsletterEmail').value;
            
            if (validateEmail(email)) {
                showNotification('Successfully subscribed to newsletter!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/* #endregion */

/* #region Notification System */
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-alert');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `alert alert-${getAlertType(type)} notification-alert position-fixed`;
    
    // Position notification at current viewport, not fixed to top
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const notificationTop = scrollTop + 20; // 20px from top of current viewport
    
    notification.style.cssText = `
        top: ${notificationTop}px; 
        right: 20px; 
        z-index: 1050; 
        min-width: 320px; 
        max-width: 420px;
        position: absolute;
    `;
    
    notification.innerHTML = `
        <div class="d-flex align-items-start">
            <div class="me-3">
                <i class="fas ${getNotificationIcon(type)}" style="font-size: 1.2rem; margin-top: 2px;"></i>
            </div>
            <div class="flex-grow-1">
                <div class="fw-bold mb-1">${getNotificationTitle(type)}</div>
                <div style="white-space: pre-line; font-size: 0.9rem; line-height: 1.4;">${message}</div>
            </div>
            <button type="button" class="btn-close ms-2" onclick="this.closest('.notification-alert').remove()" style="font-size: 0.8rem;"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 6000);
    
    // Add click to dismiss
    notification.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn-close')) {
            this.remove();
        }
    });
}

function getAlertType(type) {
    const typeMap = {
        'success': 'success',
        'error': 'danger',
        'warning': 'warning',
        'info': 'info'
    };
    return typeMap[type] || 'info';
}

function getNotificationIcon(type) {
    const iconMap = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-triangle',
        'warning': 'fa-exclamation-circle',
        'info': 'fa-info-circle'
    };
    return iconMap[type] || 'fa-info-circle';
}

function getNotificationTitle(type) {
    const titleMap = {
        'success': 'Success!',
        'error': 'Error!',
        'warning': 'Warning!',
        'info': 'Notice'
    };
    return titleMap[type] || 'Notice';
}
/* #endregion */

/* #region Map Integration */
function openMap() {
    const address = "COFFEE CORNER By PeyPeyDy, Phnom Penh"; /* just placeholder */
    const encodedAddress = encodeURIComponent(address);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    // Open in new tab
    window.open(mapUrl, '_blank');
    
    showNotification('Opening Google Maps in a new tab...', 'info');
}
/* #endregion */

/* #region Scroll Effects & Animations */
function animateOnScroll() {
    const elements = document.querySelectorAll('.menu-item, .testimonial-card, .gallery-image');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// Navbar background change on scroll
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        // More opaque when scrolled
        navbar.style.background = 'rgba(245, 241, 232, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.borderBottom = '1px solid rgba(196, 164, 124, 0.3)';
    } else {
        // Semi-transparent at top
        navbar.style.background = 'rgba(245, 241, 232, 0.95)';
        navbar.style.backdropFilter = 'blur(15px)';
        navbar.style.borderBottom = '1px solid rgba(196, 164, 124, 0.2)';
    }
    
    // Handle dark theme navbar
    if (document.body.hasAttribute('data-theme')) {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(44, 36, 25, 0.98)';
        } else {
            navbar.style.background = 'rgba(44, 36, 25, 0.95)';
        }
    }
}

// Add scroll event listeners
window.addEventListener('scroll', function() {
    animateOnScroll();
    handleNavbarScroll();
});
/* #endregion */

/* #region Gallery Image Interactions */
document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(image => {
        image.addEventListener('click', function() {
            // Create modal for image viewing
            const modal = document.createElement('div');
            modal.className = 'gallery-modal';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                cursor: pointer;
            `;
            
            const modalImage = document.createElement('img');
            modalImage.src = this.src;
            modalImage.alt = this.alt;
            modalImage.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
                border-radius: 10px;
            `;
            
            modal.appendChild(modalImage);
            document.body.appendChild(modal);
            
            // Close modal when clicked
            modal.addEventListener('click', function() {
                this.remove();
            });
            
            // Close modal with ESC key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && document.querySelector('.gallery-modal')) {
                    document.querySelector('.gallery-modal').remove();
                }
            });
        });
    });
});
/* #endregion */

/* #region Initialization */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    animateOnScroll();
    
    // Initialize navbar scroll effect
    handleNavbarScroll();
    
    // Add loading animation to page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize any other components
    console.log('June Coffee Shop website loaded successfully!');
});
/* #endregion */