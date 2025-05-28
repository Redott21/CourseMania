 // Course data
 const courseData = {
    'Complete Web Development Bootcamp': {
        description: 'Learn HTML, CSS, JavaScript, Node.js, React, and more in this comprehensive bootcamp.',
        duration: '54 hours',
        students: 12543,
        modules: 25,
        level: 'Beginner to Advanced'
    },
    'Python for Data Science': {
        description: 'Master Python programming for data analysis, visualization, and machine learning.',
        duration: '42 hours',
        students: 8321,
        modules: 18,
        level: 'Intermediate'
    },
    'Digital Marketing Mastery': {
        description: 'Complete guide to digital marketing including SEO, social media, and PPC advertising.',
        duration: '36 hours',
        students: 15678,
        modules: 22,
        level: 'Beginner'
    },
    'AWS Cloud Practitioner': {
        description: 'Prepare for AWS Cloud Practitioner certification with hands-on labs and practice tests.',
        duration: '28 hours',
        students: 25431,
        modules: 15,
        level: 'Beginner to Intermediate'
    },
    'Google Analytics Certification': {
        description: 'Master Google Analytics and get certified. Learn to track, analyze, and optimize website performance.',
        duration: '20 hours',
        students: 18902,
        modules: 12,
        level: 'Beginner'
    },
    'PMP Certification Prep': {
        description: 'Complete preparation for Project Management Professional certification exam.',
        duration: '48 hours',
        students: 9876,
        modules: 20,
        level: 'Intermediate to Advanced'
    }
};

// User state
let userState = {
    enrolledCourses: [],
    cart: [],
    wishlist: []
};

// Add interactive functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create modal for course details
    createModal();
    
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    searchInput.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const courseCards = document.querySelectorAll('.course-card');
        
        courseCards.forEach(card => {
            const title = card.querySelector('.course-title').textContent.toLowerCase();
            const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || instructor.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else if (searchTerm !== '') {
                card.style.opacity = '0.3';
            } else {
                card.style.opacity = '1';
            }
        });
    });

    // Course card interactions
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        // Add click event to show course details
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('enroll-btn') && !e.target.classList.contains('wishlist-btn')) {
                const courseTitle = this.querySelector('.course-title').textContent;
                showCourseModal(courseTitle);
            }
        });

        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Add wishlist button
        const courseContent = card.querySelector('.course-content');
        const wishlistBtn = document.createElement('button');
        wishlistBtn.className = 'wishlist-btn';
        wishlistBtn.innerHTML = '♡';
        wishlistBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        card.style.position = 'relative';
        card.appendChild(wishlistBtn);

        wishlistBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseTitle = card.querySelector('.course-title').textContent;
            toggleWishlist(courseTitle, this);
        });
    });

    // Enroll button interactions
    const enrollButtons = document.querySelectorAll('.enroll-btn');
    enrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const courseTitle = this.closest('.course-card').querySelector('.course-title').textContent;
            enrollInCourse(courseTitle, this);
        });
    });

    // Login button functionality
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.addEventListener('click', function() {
        showLoginModal();
    });

    // CTA button functionality
    const ctaBtn = document.querySelector('.cta-btn');
    ctaBtn.addEventListener('click', function() {
        document.querySelector('#courses').scrollIntoView({ behavior: 'smooth' });
    });

    // Instructor card interactions
    const instructorCards = document.querySelectorAll('.instructor-card');
    instructorCards.forEach(card => {
        card.addEventListener('click', function() {
            const instructorName = this.querySelector('.instructor-name').textContent;
            showInstructorModal(instructorName);
        });
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.querySelector(`#${targetId}`) || 
                                document.querySelector('.section');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'white';
            header.style.backdropFilter = 'none';
        }
    });

    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe course cards and instructor cards
    const animatedElements = document.querySelectorAll('.course-card, .instructor-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Create modal function
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'courseModal';
    modal.style.cssText = `
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        margin: 5% auto;
        padding: 2rem;
        border-radius: 15px;
        width: 90%;
        max-width: 600px;
        position: relative;
        animation: slideIn 0.3s ease;
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Show course modal
function showCourseModal(courseTitle) {
    const modal = document.getElementById('courseModal');
    const modalContent = modal.querySelector('div');
    const course = courseData[courseTitle];

    if (course) {
        modalContent.innerHTML = `
            <button onclick="document.getElementById('courseModal').style.display='none'" 
                    style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
            <h2 style="margin-bottom: 1rem; color: #2c5530;">${courseTitle}</h2>
            <p style="margin-bottom: 1rem; color: #666; font-size: 1.1rem;">${course.description}</p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin: 1.5rem 0;">
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #2c5530;">${course.duration}</div>
                    <div style="color: #666;">Total Duration</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #2c5530;">${course.students.toLocaleString()}</div>
                    <div style="color: #666;">Students</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #2c5530;">${course.modules}</div>
                    <div style="color: #666;">Modules</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 1.2rem; font-weight: 600; color: #2c5530;">${course.level}</div>
                    <div style="color: #666;">Level</div>
                </div>
            </div>
            <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                <button onclick="enrollInCourse('${courseTitle}', this)" 
                        style="flex: 1; background: #2c5530; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Enroll Now
                </button>
                <button onclick="addToCart('${courseTitle}')" 
                        style="flex: 1; background: transparent; color: #2c5530; border: 2px solid #2c5530; padding: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    Add to Cart
                </button>
            </div>
        `;
        modal.style.display = 'block';
    }
}

// Enroll in course function
function enrollInCourse(courseTitle, button) {
    if (!userState.enrolledCourses.includes(courseTitle)) {
        userState.enrolledCourses.push(courseTitle);
        button.style.background = '#28a745';
        button.textContent = 'Enrolled!';
        button.disabled = true;
        
        // Show success message
        showNotification(`Successfully enrolled in "${courseTitle}"!`, 'success');
        
        // Update all enroll buttons for this course
        const allEnrollButtons = document.querySelectorAll('.enroll-btn');
        allEnrollButtons.forEach(btn => {
            const cardTitle = btn.closest('.course-card')?.querySelector('.course-title')?.textContent;
            if (cardTitle === courseTitle) {
                btn.style.background = '#28a745';
                btn.textContent = 'Enrolled!';
                btn.disabled = true;
            }
        });
    }
}

// Add to cart function
function addToCart(courseTitle) {
    if (!userState.cart.includes(courseTitle)) {
        userState.cart.push(courseTitle);
        showNotification(`"${courseTitle}" added to cart!`, 'info');
    } else {
        showNotification(`"${courseTitle}" is already in your cart!`, 'warning');
    }
}

// Toggle wishlist function
function toggleWishlist(courseTitle, button) {
    if (userState.wishlist.includes(courseTitle)) {
        userState.wishlist = userState.wishlist.filter(course => course !== courseTitle);
        button.innerHTML = '♡';
        button.style.color = '#666';
        showNotification(`Removed "${courseTitle}" from wishlist`, 'info');
    } else {
        userState.wishlist.push(courseTitle);
        button.innerHTML = '♥';
        button.style.color = '#ff4444';
        showNotification(`Added "${courseTitle}" to wishlist!`, 'success');
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Set color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Show login modal
function showLoginModal() {
    const modal = document.getElementById('courseModal');
    const modalContent = modal.querySelector('div');
    
    modalContent.innerHTML = `
        <button onclick="document.getElementById('courseModal').style.display='none'" 
                style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        <h2 style="margin-bottom: 2rem; text-align: center; color: #2c5530;">Login to CourseMania</h2>
        <form style="display: flex; flex-direction: column; gap: 1rem;">
            <input type="email" placeholder="Email" required 
                   style="padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
            <input type="password" placeholder="Password" required 
                   style="padding: 0.75rem; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 1rem;">
            <button type="submit" onclick="handleLogin(event)" 
                    style="background: #2c5530; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
                Login
            </button>
        </form>
        <p style="text-align: center; margin-top: 1rem; color: #666;">
            Don't have an account? <a href="#" style="color: #2c5530; text-decoration: none;">Sign up</a>
        </p>
    `;
    modal.style.display = 'block';
}

// Handle login
function handleLogin(event) {
    event.preventDefault();
    showNotification('Login successful! Welcome back!', 'success');
    document.getElementById('courseModal').style.display = 'none';
    
    // Update login button
    const loginBtn = document.querySelector('.login-btn');
    loginBtn.textContent = 'Profile';
}

// Show instructor modal
function showInstructorModal(instructorName) {
    const modal = document.getElementById('courseModal');
    const modalContent = modal.querySelector('div');
    
    const instructorInfo = {
        'Angela Yu': {
            bio: 'Lead iOS Developer and Full-Stack Web Developer. Former Lead Developer at London App Brewery.',
            expertise: 'iOS Development, Web Development, Python, Swift',
            experience: '10+ years'
        },
        'Stephane Maarek': {
            bio: 'AWS Solutions Architect and DevOps Engineer. Author of best-selling AWS courses.',
            expertise: 'AWS, Cloud Computing, DevOps, Kafka',
            experience: '8+ years'
        },
        'Jose Marcial': {
            bio: 'Data Scientist and Machine Learning Engineer with expertise in Python and R.',
            expertise: 'Data Science, Machine Learning, Python, Statistics',
            experience: '7+ years'
        },
        'Neil Patel': {
            bio: 'Digital Marketing Expert and Entrepreneur. Co-founder of Crazy Egg and Hello Bar.',
            expertise: 'SEO, Content Marketing, Growth Hacking, Analytics',
            experience: '15+ years'
        }
    };

    const info = instructorInfo[instructorName];
    
    modalContent.innerHTML = `
        <button onclick="document.getElementById('courseModal').style.display='none'" 
                style="position: absolute; top: 1rem; right: 1rem; background: none; border: none; font-size: 1.5rem; cursor: pointer;">×</button>
        <div style="text-align: center; margin-bottom: 2rem;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(45deg, #2c5530, #4a7c59); margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: 600;">
                ${instructorName.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 style="color: #2c5530; margin-bottom: 0.5rem;">${instructorName}</h2>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">About</h3>
            <p style="color: #666; line-height: 1.6;">${info?.bio || 'Experienced instructor and industry expert.'}</p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Expertise</h3>
            <p style="color: #666;">${info?.expertise || 'Various technical subjects'}</p>
        </div>
        <div style="margin-bottom: 2rem;">
            <h3 style="color: #333; margin-bottom: 0.5rem;">Experience</h3>
            <p style="color: #666;">${info?.experience || '5+ years'}</p>
        </div>
        <button onclick="showInstructorCourses('${instructorName}')" 
                style="width: 100%; background: #2c5530; color: white; border: none; padding: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer;">
            View Courses
        </button>
    `;
    modal.style.display = 'block';
}

// Show instructor courses
function showInstructorCourses(instructorName) {
    showNotification(`Showing courses by ${instructorName}`, 'info');
    document.getElementById('courseModal').style.display = 'none';
    
    // Filter courses by instructor (simulate)
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        const instructor = card.querySelector('.course-instructor').textContent.toLowerCase();
        if (instructor.includes(instructorName.toLowerCase())) {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 10px 30px rgba(44, 85, 48, 0.3)';
        } else {
            card.style.opacity = '0.5';
        }
    });

    // Reset after 3 seconds
    setTimeout(() => {
        courseCards.forEach(card => {
            card.style.transform = '';
            card.style.boxShadow = '';
            card.style.opacity = '';
        });
    }, 3000);
}