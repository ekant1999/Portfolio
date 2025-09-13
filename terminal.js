$(function() {
  
    $('.prompt').html('user@ubuntu:~$ ');

  // Initialize desktop terminal
  var term = new Terminal('#input-line .cmdline', '#terminal');
  term.init();
  
  // Initialize mobile terminal if it exists
  if (document.getElementById('input-line-mobile')) {
    var mobileTerm = new Terminal('#input-line-mobile .cmdline', '#terminal-mobile-output');
    mobileTerm.init();
  }
  
  // Add interactive effects
  addInteractiveEffects();
  
  // Initialize window system
  initializeWindowSystem();
  
  // Initialize date/time display
  initializeDateTime();
  
  // Initialize mobile window navigation
  initializeMobileWindowNav();
  
  // Initialize mobile menu
  initializeMobileMenu();
  
});

// Interactive Effects Function
function addInteractiveEffects() {
  // Add click effect to terminal window buttons
  $('.prp').on('click', function(e) {
    e.preventDefault();
    $(this).addClass('clicked');
    setTimeout(() => {
      $(this).removeClass('clicked');
    }, 200);
  });
  
  // Add typing sound effect (visual feedback)
  $('.cmdline').on('keydown', function() {
    $(this).addClass('typing');
    setTimeout(() => {
      $(this).removeClass('typing');
    }, 100);
  });
  
  // Add hover effect to social icons
  $('.title-logo').on('mouseenter', function() {
    $(this).addClass('icon-hover');
  }).on('mouseleave', function() {
    $(this).removeClass('icon-hover');
  });
  
  // Add smooth scroll for navigation
  $('nav a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    const target = $(this.getAttribute('href'));
    if (target.length) {
      $('html, body').animate({
        scrollTop: target.offset().top - 100
      }, 800);
    }
  });
}

// Enhanced clear function for better terminal reset
function clearTerminal(outputElement) {
  if (outputElement) {
    outputElement.innerHTML = '';
    outputElement.scrollTop = 0;
  }
}

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

// Avengers-style disappearing effect function
function avengersDisappearEffect() {
  const terminalOutput = document.getElementById('terminal');
  if (!terminalOutput) return;
  
  // Get all elements to remove: both output paragraphs and command lines
  const outputElements = terminalOutput.querySelectorAll('p');
  const commandLines = terminalOutput.querySelectorAll('.line');
  
  // Also get any other content elements
  const allContent = terminalOutput.children;
  const allElements = [];
  
  // Add all child elements except the current input line
  for (let i = 0; i < allContent.length; i++) {
    const element = allContent[i];
    // Skip the current input line (the one with id="input-line")
    if (!element.id || element.id !== 'input-line') {
      allElements.push(element);
    }
  }
  
  if (allElements.length === 0) return;
  
  // Create disappearing effect for each element
  allElements.forEach((element, index) => {
    setTimeout(() => {
      // Add dust particle effect
      element.style.position = 'relative';
      element.style.overflow = 'hidden';
      
      // Create dust particles
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = '#ffd700';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * element.offsetWidth + 'px';
        particle.style.top = Math.random() * element.offsetHeight + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        // Add particle animation
        particle.style.animation = `dustParticle 2s ease-out forwards`;
        element.appendChild(particle);
      }
      
      // Fade out the element
      element.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
      element.style.opacity = '0';
      element.style.transform = 'scale(0.8) translateY(-20px)';
      
      // Remove element after animation
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 1000);
      
    }, index * 200); // Stagger the disappearing effect
  });
}

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'whoami', 'education', 'programming', 'interests', 'contact', 'clear', 'help', 'oops'
  ];
  
  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function(e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      } 
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function(val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          // Reset scroll position to top
          output_.scrollTop = 0;
          // Focus back to input
          setTimeout(() => {
            this.focus();
          }, 10);
          return;
        case 'help':
          var result = "<h3>Available Commands</h3><p><b>whoami</b> - Show personal info<br><b>education</b> - Show education timeline<br><b>programming</b> - Show programming achievements<br><b>interests</b> - Display my interests<br><b>contact</b> - Say hi<br><b>clear</b> - Clear terminal output<br><b>oops</b> - Oops<br><b>help</b> - Show help menu</p>";
          output(result);
          break;
        case 'education':
          var result = "<h3>Education:</h3>"+"<p><strong>San Jose State University, San Jose, CA</strong><br>Aug. 2025 – May 2027<br>Master of Science in Computer Software Engineering</p><br><p><strong>Shri Guru Gobind Singhji Inst of Eng and Tech, Nanded</strong><br>Aug. 2016 – Sept 2020<br>Bachelors of Technology in Computer Science<br>CGPA - 8.66</p><br>";
          output(result);
          break;
        case 'interests': 
          var result = "<h3>Interests</h3><p>Machine Learning, Deep Learning, AI, Algorithms,</br>Data Structures, Problem Solving, Reading,</br>Open Source Technologies...&#128151;</p>";
          output(result);
          break;
        case 'contact':
          var result = "<h3>Contact</h3><b>Email</b>: <a href=\"mailto:ekantkapgate@gmail.com\" >ekantkapgate@gmail.com</a> </br><b>Instagram</b>: ekant1999<br><b>linkedin</b>: <a href=\"https://www.linkedin.com/in/ekant-kapgate-494854167/\">linkedin.com/in/ekant-kapgate-494854167/</a><br><b>Github</b>: <a href=\"https://github.com/ekant1999\">github.com/ekant1999</a>";
          output(result);

          break;
        case 'whoami':
          var result = "<h2>Ekant Kapgate</h2><p>Loves to code, ML & DL enthusiast <span >&#128513;</span></p><p>I am a passionate developer from Nagpur.</br>I am interested in machine learning, deep learning,</br>algorithms, and data structures.</br>I love sharing code, knowledge, and experiences.</br>I enjoy meeting new people and discovering new cultures.</br></p>"
          output(result);
           
          break;
        case 'programming':
          var result = "<h3>Programming Skills</h3><p><b>Languages:</b> Python, JavaScript, Java, C++, C#</br><b>Frameworks:</b> React, Node.js, Django, ASP.NET Core</br><b>Tools:</b> Git, Docker, AWS, Postman</br><b>Databases:</b> MySQL, MongoDB, PostgreSQL, SQLite</br><b>ML/DL:</b> TensorFlow, PyTorch, Scikit-learn, Computer Vision</br><b>Mobile:</b> Android Development</br><b>Protocols:</b> gRPC, HTTP, REST APIs</p>";
          output(result);
          break;
        case 'oops':
          var result="<p>Did I do that? 😅</p>"
          output(result);
          // Avengers-style disappearing effect - start immediately
          avengersDisappearEffect();
          break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      // Auto-scroll terminal to bottom
      setTimeout(function() {
        output_.scrollTop = output_.scrollHeight;
      }, 10);
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //
  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function(entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
        'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
            colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
    // Auto-scroll to bottom after adding content
    setTimeout(function() {
      output_.scrollTop = output_.scrollHeight;
    }, 10);
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
        Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
        Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
        Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function() {
      output('<p>-- Terminal was built with JavaScript and love &#10084;&#65039;</p><p>-- Type \'help\' for available commands</p>');
    },
    output: output
  }
};


$(document).on('keypress',function(e) {
    if(e.which == 13) {
        var terminalOutput = document.getElementById('terminal');
        if(terminalOutput) {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }
});
// Auto-scroll function for terminal
var autoScrollTerminal = function() {
  var terminalOutput = document.getElementById('terminal');
  if(terminalOutput) {
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
};

// Initialize terminal scroll
setTimeout(autoScrollTerminal, 100);

function hinge(thing) {
  $(thing).addClass('animated hinge');
  $(thing).on('animationend mozanimationend webkitAnimationEnd oAnimationEnd msanimationend', function() {
    $(thing).remove();
  });
}

// Window System
let windowCounter = 0;
let openWindows = {};
let minimizedWindows = {}; // Track minimized windows separately
let mobileWindowStack = [];
let currentMobileWindowIndex = 0;

function initializeWindowSystem() {
  // Handle icon clicks (exclude resume which is a direct link)
  $('.icon').on('click', function(e) {
    // Check if this is the resume icon (direct link)
    if ($(this).attr('href')) {
      return; // Let the default link behavior happen
    }
    
    e.preventDefault();
    const windowType = $(this).data('window');
    openWindow(windowType);
  });
  
  // Handle window control buttons
  $(document).on('click', '.window-btn', function(e) {
    e.preventDefault();
    const $window = $(this).closest('.floating-window');
    const windowId = $window.attr('id');
    
    if ($(this).hasClass('close')) {
      closeWindow(windowId);
    } else if ($(this).hasClass('minimize')) {
      minimizeWindow(windowId);
    } else if ($(this).hasClass('maximize')) {
      maximizeWindow(windowId);
    }
  });
  
  
  // Make windows draggable
  $(document).on('mousedown', '.window-header', function(e) {
    const $window = $(this).closest('.floating-window');
    const windowId = $window.attr('id');
    startDragging(windowId, e);
  });
}

function openWindow(windowType) {
  const windowId = windowType + '_' + (++windowCounter);
  const windowData = getWindowData(windowType);
  
  console.log('Opening window:', windowType);
  console.log('Minimized windows:', minimizedWindows);
  console.log('Open windows:', openWindows);
  
  // Check if window is minimized
  if (minimizedWindows[windowType]) {
    console.log('Restoring minimized window:', minimizedWindows[windowType]);
    restoreMinimizedWindow(minimizedWindows[windowType]);
    return;
  }
  
  // Check if window is already open and visible
  if (openWindows[windowType]) {
    const existingWindowId = openWindows[windowType];
    const $existingWindow = $('#' + existingWindowId);
    
    console.log('Bringing existing window to front:', existingWindowId);
    // If window exists and is visible, bring to front
    if ($existingWindow.length) {
      bringToFront(existingWindowId);
    return;
    }
  }
  
  const $window = $(`
    <div class="floating-window" id="${windowId}" data-type="${windowType}">
      <div class="window-header">
        <div class="window-controls">
          <button class="window-btn close"></button>
          <button class="window-btn minimize"></button>
          <button class="window-btn maximize"></button>
        </div>
        <div class="window-title">${windowData.title}</div>
      </div>
      <div class="window-content">
        ${windowData.content}
      </div>
    </div>
  `);
  
  // Position window
  const x = 100 + (windowCounter * 30);
  const y = 100 + (windowCounter * 30);
  $window.css({
    left: x + 'px',
    top: y + 'px'
  });
  
  $('#windows-container').append($window);
  openWindows[windowType] = windowId;
  
  // Bring to front
  bringToFront(windowId);
}

function restoreMinimizedWindow(windowId) {
  const $window = $('#' + windowId);
  const $content = $window.find('.window-content');
  const windowType = $window.data('type');
  
  // Remove from minimized tracking
  delete minimizedWindows[windowType];
  
  // Make window visible again
  $window.css({
    'opacity': '1',
    'visibility': 'visible',
    'pointer-events': 'auto',
    'transform': 'scale(1)',
    'transition': 'transform 0.3s ease-out'
  });
  
  $content.slideDown(200);
  
  setTimeout(() => {
    $window.css({
      'transform': '',
      'transition': ''
    });
  }, 300);
  
  // Bring to front
  bringToFront(windowId);
}

function closeWindow(windowId) {
  const $window = $('#' + windowId);
  const windowType = $window.data('type');
  
  $window.fadeOut(300, function() {
    $(this).remove();
    delete openWindows[windowType];
    delete minimizedWindows[windowType]; // Also clean up minimized tracking
  });
}

function minimizeWindow(windowId) {
  const $window = $('#' + windowId);
  const $content = $window.find('.window-content');
  const windowType = $window.data('type');
  const $icon = $(`.icon[data-window="${windowType}"]`);
  
  if ($content.is(':visible')) {
    // Get window and icon positions for animation
    const windowRect = $window[0].getBoundingClientRect();
    const iconRect = $icon[0].getBoundingClientRect();
    
    // Calculate the scale and position for the animation
    const scaleX = iconRect.width / windowRect.width;
    const scaleY = iconRect.height / windowRect.height;
    const translateX = iconRect.left - windowRect.left;
    const translateY = iconRect.top - windowRect.top;
    
    // Add transition classes
    $window.addClass('minimizing');
    $content.addClass('minimizing-content');
    
    // Apply the transform
    $window.css({
      'transform': `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
      'transform-origin': 'top left',
      'transition': 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    // Hide content during animation
    setTimeout(() => {
    $content.slideUp(200);
    }, 100);
    
    // Complete the minimization - just hide the window, don't move it off-screen
    setTimeout(() => {
      $window.removeClass('minimizing');
      $content.removeClass('minimizing-content');
      $window.css({
        'transform': '',
        'transition': '',
        'opacity': '0',
        'visibility': 'hidden',
        'pointer-events': 'none'
      });
      
      // Track as minimized window
      minimizedWindows[windowType] = windowId;
    }, 600);
    
  } else {
    // Restore window
    restoreMinimizedWindow(windowId);
  }
}

function maximizeWindow(windowId) {
  const $window = $('#' + windowId);
  
  if ($window.hasClass('maximized')) {
    $window.removeClass('maximized').css({
      left: '100px',
      top: '100px',
      width: 'auto',
      height: 'auto'
    });
  } else {
    $window.addClass('maximized').css({
      left: '50px',
      top: '50px',
      width: 'calc(100vw - 100px)',
      height: 'calc(100vh - 100px)'
    });
  }
}

function bringToFront(windowId) {
  $('.floating-window').css('z-index', 1001);
  $('#' + windowId).css('z-index', 1002);
}

function startDragging(windowId, e) {
  const $window = $('#' + windowId);
  const startX = e.clientX - $window.offset().left;
  const startY = e.clientY - $window.offset().top;
  
  $(document).on('mousemove', function(e) {
    $window.css({
      left: (e.clientX - startX) + 'px',
      top: (e.clientY - startY) + 'px'
    });
  });
  
  $(document).one('mouseup', function() {
    $(document).off('mousemove');
  });
}

function getWindowData(windowType) {
  const windowData = {
    about: {
      title: 'About Me',
      content: `
        <h1>About Me</h1>
        <h2>Hello, I'm Ekant Kapgate</h2>
        <p>I am a passionate developer from San Jose, California, USA. I love to code and am enthusiastic about <strong>machine learning</strong>, <strong>deep learning</strong>, <strong>algorithms</strong>, and <strong>data structures</strong>.</p>
        <p>I enjoy sharing code, knowledge, and experiences. I love meeting new people and discovering new cultures. Currently pursuing my Master's in Computer Software Engineering at San Jose State University.</p>
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:ekantkapgate@gmail.com">ekantkapgate@gmail.com</a></li>
          <li><strong>Location:</strong> San Jose, California, USA</li>
          <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ekant-kapgate-494854167/" target="_blank">linkedin.com/in/ekant-kapgate-494854167/</a></li>
          <li><strong>GitHub:</strong> <a href="https://github.com/ekant1999" target="_blank">github.com/ekant1999</a></li>
        </ul>
        <h3>Technologies I Love</h3>
        <p><code>Python</code> <code>JavaScript</code> <code>React</code> <code>TensorFlow</code> <code>Node.js</code></p>
      `
    },
    experience: {
      title: 'Experience',
      content: `
        <h1>Professional Experience</h1>
        
        <div class="timeline-container">
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h2>Senior Software Engineer</h2>
                <div class="timeline-badge current">Recent</div>
              </div>
              <h3>Optym, Bengaluru India</h3>
              <div class="timeline-period">Jan 2024 – Aug 2025</div>
              <ul class="achievement-list">
                <li>Built an <strong>agentic chatbot</strong> using Python, FastAPI, MongoDB, and Azure OpenAI to accelerate production incident troubleshooting across <strong>100K+ tickets</strong>.</li>
                <li>Integrated vector search and prompt engineering to intelligently query <strong>50K+ Confluence documents</strong> with context management, achieving <strong>20% reduction</strong> in incident resolution time.</li>
                <li>Developed optimization service with .Net Core implementing Neural Large Neighborhood Search with mixed-integer programming to deliver <strong>23% improvement</strong> over baseline methods.</li>
                <li>Led enterprise application modernization through .NET Core migration with Clean Architecture, DI, and Repository patterns to deliver <strong>30% performance gains</strong> and <strong>40% cyclomatic complexity reduction</strong>.</li>
              </ul>
              <div class="timeline-skills">
                <span class="skill-tag">Python</span>
                <span class="skill-tag">LLMs</span>
                <span class="skill-tag">Prompt Engineering</span>
                <span class="skill-tag">Azure</span>
                <span class="skill-tag">MongoDB</span>
                <span class="skill-tag">FastAPI</span>
                <span class="skill-tag">.NET Core</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h2>Software Engineer</h2>
                <div class="timeline-badge">Full-time</div>
              </div>
              <h3>Optym, Bengaluru India</h3>
              <div class="timeline-period">Mar 2021 – Jan 2024</div>
              <ul class="achievement-list">
                <li>Architected microservices data layer using <strong>gRPC and CQRS patterns</strong> to enhance system performance by <strong>30%</strong> with horizontal scalability.</li>
                <li>Designed in-memory caching framework with Redis and .NET Core to reduce <strong>page load times by 60%</strong>.</li>
                <li>Engineered a KPI benchmarking workflow leveraging SQL and Python to run <strong>5,000+ scenarios</strong>, saving <strong>6 hours/week</strong> and increasing release confidence.</li>
                <li>Delivered production-ready code using <strong>test-driven development (TDD)</strong> principles and collaborated with cross-functional teams to meet project goals.</li>
                <li>Deployed backend services using <strong>Azure Kubernetes Service (AKS)</strong> and CI/CD to enhance release efficiency and reliability.</li>
              </ul>
              <div class="timeline-skills">
                <span class="skill-tag">.NET Core</span>
                <span class="skill-tag">C#</span>
                <span class="skill-tag">Redis</span>
                <span class="skill-tag">SQL</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">Kubernetes</span>
                <span class="skill-tag">gRPC</span>
                <span class="skill-tag">CQRS</span>
                <span class="skill-tag">TDD</span>
                <span class="skill-tag">AKS</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h2>Software Development Intern</h2>
                <div class="timeline-badge">Internship</div>
              </div>
              <h3>Kratin LLC, India</h3>
              <div class="timeline-period">Dec 2019 – June 2020</div>
              <ul class="achievement-list">
                <li>Built a <strong>real-time notification system</strong> with Kafka that automated oncology treatment alerts, to reduce care coordination time by <strong>1 hour per patient</strong>.</li>
                <li>Developed <strong>HIPAA-compliant backend services</strong> with Spring Boot and Java, enabling secure workflows across <strong>4M+ patient records</strong> with <strong>99.9% uptime</strong>.</li>
                <li>Created responsive medication management UI using React to cut <strong>manual billing by 70%</strong> and enable same-day settlements.</li>
              </ul>
              <div class="timeline-skills">
                <span class="skill-tag">Spring Boot</span>
                <span class="skill-tag">Kafka</span>
                <span class="skill-tag">React</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">SQL</span>
                <span class="skill-tag">Java</span>
                <span class="skill-tag">HIPAA</span>
              </div>
            </div>
          </div>
          
          <div class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
              <div class="marker-pulse"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h2>Summer Research Intern</h2>
                <div class="timeline-badge">Research</div>
              </div>
              <h3>Bennett University — Noida, India</h3>
              <div class="timeline-period">June 2019 – Aug 2019</div>
              <ul class="achievement-list">
                <li>Developed a recommendation engine using Restricted Boltzmann Machines on implicit feedback datasets.</li>
                <li>Improved top-N recommendation precision by <strong>20%</strong> over kNN baselines.</li>
              </ul>
              <div class="timeline-skills">
                <span class="skill-tag">Recommendation Systems</span>
                <span class="skill-tag">RBM</span>
                <span class="skill-tag">kNN</span>
                <span class="skill-tag">Research</span>
                <span class="skill-tag">Machine Learning</span>
              </div>
            </div>
          </div>
        </div>
      `
    },
    education: {
      title: 'Education',
      content: `
        <h1>Educational Journey</h1>
        
        <div class="education-container">
          <div class="education-timeline">
            <div class="education-item current">
              <div class="education-icon">
                <div class="graduation-cap">🎓</div>
                <div class="cap-tassel"></div>
              </div>
              <div class="education-content">
                <div class="degree-header">
                  <h2>Master of Science</h2>
                  <div class="degree-badge current">In Progress</div>
                </div>
                <h3>Computer Software Engineering</h3>
                <div class="university-info">
                  <div class="university-name">San Jose State University</div>
                  <div class="university-location">San Jose, CA</div>
                </div>
                <div class="education-details">
                  <div class="duration">Aug. 2025 – May 2027</div>
                  <div class="status-indicator">
                    <span class="status-dot"></span>
                    <span class="status-text">Currently Pursuing</span>
                  </div>
                </div>
                <div class="education-skills">
                  <span class="edu-skill-tag">Advanced Software Engineering</span>
                  <span class="edu-skill-tag">System Design</span>
                  <span class="edu-skill-tag">Research Methods</span>
                </div>
              </div>
            </div>
            
            <div class="education-connector"></div>
            
            <div class="education-item completed">
              <div class="education-icon">
                <div class="graduation-cap">🎓</div>
                <div class="cap-tassel"></div>
              </div>
              <div class="education-content">
                <div class="degree-header">
                  <h2>Bachelor of Technology</h2>
                  <div class="degree-badge completed">Completed</div>
                </div>
                <h3>Computer Science</h3>
                <div class="university-info">
                  <div class="university-name">Shri Guru Gobind Singhji Inst of Eng and Tech</div>
                  <div class="university-location">Nanded, India</div>
                </div>
                <div class="education-details">
                  <div class="duration">Aug. 2016 – Sept 2020</div>
                  <div class="gpa-display">
                    <span class="gpa-label">CGPA:</span>
                    <span class="gpa-value">8.66</span>
                  </div>
                </div>
                <div class="education-skills">
                  <span class="edu-skill-tag">Computer Science</span>
                  <span class="edu-skill-tag">Data Structures</span>
                  <span class="edu-skill-tag">Algorithms</span>
                  <span class="edu-skill-tag">Software Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },
    projects: {
      title: 'Projects',
      content: `
        <h1>Featured Projects</h1>
        
        <div class="project-container">
          <div class="project-card">
            <div class="project-header">
              <h2>🔍 OCR Master - Number Plate Recognition Tool</h2>
              <div class="project-badge">Android</div>
            </div>
            <p class="project-description">Built an Android application for real-time image capture and number plate recognition, achieving a 90% accuracy rate in text extraction.</p>
            <div class="project-tech">
              <span class="tech-tag">Java</span>
              <span class="tech-tag">Android</span>
              <span class="tech-tag">Computer Vision</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/ekant1999/Android-OCRSample-master" target="_blank" class="project-link">
                <span>📁</span> View on GitHub
              </a>
            </div>
          </div>
          
          <div class="project-card">
            <div class="project-header">
              <h2>💉 Notifyme.info - COVID-19 Vaccination Slot Notifier</h2>
              <div class="project-badge impact">20K+ Users</div>
            </div>
            <p class="project-description">Developed a platform that assisted 10,000+ users in booking COVID-19 vaccination slots by providing real-time push notifications for availability, addressing critical community needs in India.</p>
            <div class="project-tech">
              <span class="tech-tag">JavaScript</span>
              <span class="tech-tag">Node.js</span>
              <span class="tech-tag">Firebase</span>
              <span class="tech-tag">HTML/CSS</span>
            </div>
            <div class="project-links">
              <a href="https://notifyme.info" target="_blank" class="project-link">
                <span>🌐</span> Visit Website
              </a>
            </div>
          </div>
          
          <div class="project-card">
            <div class="project-header">
              <h2>🏗️ Tower of Hanoi Visualizer</h2>
              <div class="project-badge">Educational</div>
            </div>
            <p class="project-description">Created an interactive Tower of Hanoi visualization tool to aid in the educational understanding of algorithmic principles.</p>
            <div class="project-tech">
              <span class="tech-tag">JavaScript</span>
              <span class="tech-tag">HTML</span>
              <span class="tech-tag">CSS</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/ekant1999/Tower-of-Hanoi-Visualizer" target="_blank" class="project-link">
                <span>📁</span> View on GitHub
              </a>
            </div>
          </div>
          
          <div class="project-card">
            <div class="project-header">
              <h2>📝 GrpcService ToDo App</h2>
              <div class="project-badge">Microservice</div>
            </div>
            <p class="project-description">Built a gRPC ToDo microservice with full HTTP/JSON transcoding, enabling the same protobuf methods to be invoked from REST clients like curl/Postman. Designed protobuf service contracts and mapped HTTP verbs/paths via transcoding annotations to expose RESTful CRUD endpoints without duplicating controllers.</p>
            <div class="project-tech">
              <span class="tech-tag">gRPC</span>
              <span class="tech-tag">ASP.NET Core</span>
              <span class="tech-tag">SQL</span>
              <span class="tech-tag">Postman</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/ekant1999/GrpcService" target="_blank" class="project-link">
                <span>📁</span> View on GitHub
              </a>
            </div>
          </div>
          
          <div class="project-card">
            <div class="project-header">
              <h2>⚖️ PaxBalancer - HTTP Load Balancer</h2>
              <div class="project-badge">Infrastructure</div>
            </div>
            <p class="project-description">Built a lightweight, multi-threaded load balancer that routes traffic across backends using a round-robin algorithm for even distribution. Implemented active /health checks to automatically remove unhealthy servers from rotation and reinstate them on recovery for high availability.</p>
            <div class="project-tech">
              <span class="tech-tag">C#</span>
              <span class="tech-tag">Sockets</span>
              <span class="tech-tag">Multi-threading</span>
              <span class="tech-tag">HTTP Proxying</span>
            </div>
            <div class="project-links">
              <a href="https://github.com/ekant1999/paxBalancer" target="_blank" class="project-link">
                <span>📁</span> View on GitHub
              </a>
            </div>
          </div>
        </div>
      `
    },
    achievements: {
      title: 'Achievements',
      content: `
        <h1>Achievements & Recognitions</h1>
        <h2>🏆 Hackathon Winner</h2>
        <p>First place in regional coding competition</p>
        <p><strong>Year:</strong> 2023</p>
        
        <h2>⭐ Open Source Contributor</h2>
        <p>Active contributor to multiple open source projects</p>
        <p><strong>Period:</strong> 2022-2023</p>
        
        <h2>🎯 Academic Excellence</h2>
        <p>Consistent academic performance throughout studies</p>
        <p><strong>Period:</strong> 2016-2020</p>
      `
    },
    courses: {
      title: 'Courses & Certificates',
      content: `
        <h1>Learning & Certifications</h1>
        
        <div class="certifications-container">
          <div class="certification-category">
            <h2>🎓 Machine Learning & Deep Learning</h2>
            <div class="certification-grid">
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Structuring Machine Learning Projects</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
        <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Oct 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/ZETM64G7XZNC" target="_blank">ZETM64G7XZNC</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Improving Deep Neural Networks</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Aug 2019</p>
                <p><strong>Focus:</strong> Hyperparameter tuning, Regularization and Optimization</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/8DPYF4C8DB7K" target="_blank">8DPYF4C8DB7K</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Neural Networks and Deep Learning</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Feb 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/TWFMUUAKFYHS" target="_blank">TWFMUUAKFYHS</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>How Google does Machine Learning</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Jan 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/87YMUEVMNZZ4" target="_blank">87YMUEVMNZZ4</a></p>
              </div>
            </div>
          </div>
          
          <div class="certification-category">
            <h2>🐍 Python & Data Science</h2>
            <div class="certification-grid">
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Python for Data Science and AI by IBM</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Aug 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/AEGLWNJV8CHG" target="_blank">AEGLWNJV8CHG</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>IBM Digital Badge - Python for Applied Data Science</h3>
                  <div class="cert-badge">IBM</div>
                </div>
                <p><strong>Provider:</strong> IBM via Coursera</p>
                <p><strong>Issued:</strong> Aug 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.youracclaim.com/org/ibm/badge/python-for-applied-data-science" target="_blank">View Badge</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Python Data Structures</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> May 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/NLQL6YTW8JZU" target="_blank">NLQL6YTW8JZU</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Programming for Everybody</h3>
                  <div class="cert-badge">Coursera</div>
                </div>
                <p><strong>Provider:</strong> Coursera</p>
                <p><strong>Issued:</strong> Mar 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://www.coursera.org/account/accomplishments/certificate/M3UQS9DZB6RU" target="_blank">M3UQS9DZB6RU</a></p>
              </div>
            </div>
          </div>
          
          <div class="certification-category">
            <h2>🖥️ Computer Vision & Specialized</h2>
            <div class="certification-grid">
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Fundamentals of Deep Learning for Computer Vision</h3>
                  <div class="cert-badge">NVIDIA</div>
                </div>
                <p><strong>Provider:</strong> NVIDIA Virtual GPU</p>
                <p><strong>Issued:</strong> Mar 2019</p>
                <p><strong>Credential ID:</strong> <a href="https://courses.nvidia.com/certificates/b5f62c6de0a14392afce5127d59d127b" target="_blank">View Certificate</a></p>
              </div>
              
              <div class="certification-item">
                <div class="cert-header">
                  <h3>Core Java</h3>
                  <div class="cert-badge">Atlanta</div>
                </div>
                <p><strong>Provider:</strong> Atlanta</p>
                <p><strong>Issued:</strong> Jun 2017</p>
                <p><strong>Focus:</strong> Java Programming Fundamentals</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    skills: {
      title: 'Skills',
      content: `
        <h1>Technical Skills</h1>
        
        <div class="skills-container">
          <div class="skill-category">
            <h2>💻 Programming Languages</h2>
            <div class="skill-grid">
              <div class="skill-item expert">
                <span class="skill-name">C#</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 100%"></div>
                </div>
                <span class="skill-percent">100%</span>
              </div>
              <div class="skill-item expert">
                <span class="skill-name">Java</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 95%"></div>
                </div>
                <span class="skill-percent">95%</span>
              </div>
              <div class="skill-item expert">
                <span class="skill-name">JavaScript</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 90%"></div>
                </div>
                <span class="skill-percent">90%</span>
              </div>
              <div class="skill-item expert">
                <span class="skill-name">Python</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 88%"></div>
                </div>
                <span class="skill-percent">88%</span>
              </div>
              <div class="skill-item advanced">
                <span class="skill-name">C++</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 80%"></div>
                </div>
                <span class="skill-percent">80%</span>
              </div>
              <div class="skill-item advanced">
                <span class="skill-name">Go</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 75%"></div>
                </div>
                <span class="skill-percent">75%</span>
              </div>
              <div class="skill-item intermediate">
                <span class="skill-name">TypeScript</span>
                <div class="skill-level">
                  <div class="skill-bar" style="width: 70%"></div>
                </div>
                <span class="skill-percent">70%</span>
              </div>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🌐 Web Technologies</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">React</span>
              <span class="skill-tag expert">Node.js</span>
              <span class="skill-tag expert">Express.js</span>
              <span class="skill-tag expert">HTML5</span>
              <span class="skill-tag expert">CSS3</span>
              <span class="skill-tag advanced">Vue.js</span>
              <span class="skill-tag advanced">Angular</span>
              <span class="skill-tag advanced">Bootstrap</span>
              <span class="skill-tag advanced">jQuery</span>
              <span class="skill-tag intermediate">Next.js</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🗄️ Databases & Storage</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">MySQL</span>
              <span class="skill-tag expert">PostgreSQL</span>
              <span class="skill-tag expert">MongoDB</span>
              <span class="skill-tag advanced">Redis</span>
              <span class="skill-tag advanced">SQLite</span>
              <span class="skill-tag intermediate">Elasticsearch</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>☁️ Cloud & DevOps</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">AWS</span>
              <span class="skill-tag expert">Docker</span>
              <span class="skill-tag expert">Git</span>
              <span class="skill-tag expert">CI/CD</span>
              <span class="skill-tag advanced">Kubernetes</span>
              <span class="skill-tag advanced">Jenkins</span>
              <span class="skill-tag advanced">Google Cloud</span>
              <span class="skill-tag intermediate">Azure</span>
              <span class="skill-tag intermediate">Terraform</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>📱 Mobile Development</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">Android</span>
              <span class="skill-tag expert">Java (Android)</span>
              <span class="skill-tag advanced">Kotlin</span>
              <span class="skill-tag advanced">Android Studio</span>
              <span class="skill-tag intermediate">React Native</span>
              <span class="skill-tag intermediate">Flutter</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🤖 AI & Machine Learning</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">TensorFlow</span>
              <span class="skill-tag expert">PyTorch</span>
              <span class="skill-tag expert">Scikit-learn</span>
              <span class="skill-tag expert">Pandas</span>
              <span class="skill-tag expert">NumPy</span>
              <span class="skill-tag expert">OpenCV</span>
              <span class="skill-tag advanced">Computer Vision</span>
              <span class="skill-tag advanced">Deep Learning</span>
              <span class="skill-tag advanced">Matplotlib</span>
              <span class="skill-tag intermediate">Keras</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🔧 Backend & APIs</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">REST APIs</span>
              <span class="skill-tag expert">gRPC</span>
              <span class="skill-tag expert">JSON</span>
              <span class="skill-tag expert">Spring Boot</span>
              <span class="skill-tag advanced">Microservices</span>
              <span class="skill-tag advanced">Load Balancing</span>
              <span class="skill-tag advanced">HTTP Proxying</span>
              <span class="skill-tag intermediate">GraphQL</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🛠️ Tools & Frameworks</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">IntelliJ IDEA</span>
              <span class="skill-tag expert">VS Code</span>
              <span class="skill-tag expert">Postman</span>
              <span class="skill-tag expert">Firebase</span>
              <span class="skill-tag advanced">Maven</span>
              <span class="skill-tag advanced">Gradle</span>
              <span class="skill-tag advanced">JUnit</span>
              <span class="skill-tag intermediate">Selenium</span>
            </div>
          </div>
          
          <div class="skill-category">
            <h2>🎯 Specialized Skills</h2>
            <div class="skill-tags">
              <span class="skill-tag expert">Multi-threading</span>
              <span class="skill-tag expert">Socket Programming</span>
              <span class="skill-tag expert">System Design</span>
              <span class="skill-tag expert">Algorithm Design</span>
              <span class="skill-tag advanced">Distributed Systems</span>
              <span class="skill-tag advanced">Performance Optimization</span>
              <span class="skill-tag advanced">Code Review</span>
              <span class="skill-tag intermediate">Blockchain</span>
            </div>
          </div>
        </div>
      `
    },
    contact: {
      title: 'Contact',
      content: `
        <h1>Get In Touch</h1>
        <p>I'm always interested in new opportunities and collaborations. Feel free to reach out!</p>
        
        <h2>Contact Information</h2>
        <p><strong>📧 Email:</strong> <a href="mailto:ekantkapgate@gmail.com">ekantkapgate@gmail.com</a></p>
        <p><strong>📍 Location:</strong> San Jose, California, USA</p>
        <p><strong>💼 LinkedIn:</strong> <a href="https://www.linkedin.com/in/ekant-kapgate-494854167/" target="_blank">linkedin.com/in/ekant-kapgate-494854167/</a></p>
        <p><strong>🐙 GitHub:</strong> <a href="https://github.com/ekant1999" target="_blank">github.com/ekant1999</a></p>
        <p><strong>🐦 Twitter:</strong> <a href="https://twitter.com/ekant1999" target="_blank">@ekant1999</a></p>
        <p><strong>📷 Instagram:</strong> <a href="https://instagram.com/ekant1999" target="_blank">@ekant1999</a></p>
      `
    }
  };
  
  return windowData[windowType] || { title: 'Window', content: '<p>Content not available</p>' };
}

// Date and Time Display
function initializeDateTime() {
  function updateDateTime() {
    const now = new Date();
    const timeOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    const dateOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const dateTimeElement = document.getElementById('dateTime');
    
    if (dateTimeElement) {
      dateTimeElement.textContent = `${dateString} ${timeString}`;
    }
  }
  
  // Update immediately
  updateDateTime();
  
  // Update every minute (since we're only showing hours and minutes)
  setInterval(updateDateTime, 60000);
}

// Simple Mobile Slideshow
function initializeMobileWindowNav() {
  // Check if we're on mobile
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Portfolio sections data
  const sections = [
    {
      title: 'About Me',
      content: `
        <h2>👤 About Me</h2>
        <p>I'm a passionate software engineer with a strong background in full-stack development and a love for creating innovative solutions.</p>
        
        <h2>🎯 Mission</h2>
        <p>To build meaningful software that makes a positive impact on people's lives while continuously learning and growing in the ever-evolving tech landscape.</p>
        
        <h2>💡 Philosophy</h2>
        <p>I believe in clean code, user-centered design, and the power of technology to solve real-world problems. Every project is an opportunity to learn something new and make a difference.</p>
        
        <h2>🚀 Current Focus</h2>
        <p>Currently focused on modern web technologies, cloud computing, and building scalable applications that can handle real-world demands.</p>
      `
    },
    {
      title: 'Professional Experience',
      content: `
        <h2>💼 Professional Experience</h2>
        <p>I have gained valuable experience through various roles in software development and engineering.</p>
        
        <h2>🔧 Software Engineer</h2>
        <p><strong>Company:</strong> Tech Solutions Inc.</p>
        <p><strong>Duration:</strong> 2022 - Present</p>
        <p><strong>Key Responsibilities:</strong></p>
        <ul>
          <li>Developed and maintained web applications using modern frameworks</li>
          <li>Collaborated with cross-functional teams to deliver high-quality software</li>
          <li>Implemented responsive designs and optimized application performance</li>
          <li>Participated in code reviews and maintained coding standards</li>
        </ul>
        
        <h2>👨‍💻 Junior Developer</h2>
        <p><strong>Company:</strong> StartupXYZ</p>
        <p><strong>Duration:</strong> 2021 - 2022</p>
        <p><strong>Key Responsibilities:</strong></p>
        <ul>
          <li>Assisted in developing frontend and backend components</li>
          <li>Worked with databases and API integrations</li>
          <li>Contributed to testing and debugging processes</li>
        </ul>
      `
    },
    {
      title: 'Education',
      content: `
        <h2>🎓 Education</h2>
        <p>My educational background has provided me with a strong foundation in computer science and software engineering.</p>
        
        <h2>📚 Bachelor of Science in Computer Science</h2>
        <p><strong>Institution:</strong> University of Technology</p>
        <p><strong>Duration:</strong> 2017 - 2021</p>
        <p><strong>GPA:</strong> 3.8/4.0</p>
        <p><strong>Relevant Coursework:</strong></p>
        <ul>
          <li>Data Structures and Algorithms</li>
          <li>Database Systems</li>
          <li>Software Engineering</li>
          <li>Computer Networks</li>
          <li>Web Development</li>
          <li>Machine Learning</li>
        </ul>
        
        <h2>🏆 Academic Achievements</h2>
        <ul>
          <li>Dean's List for 6 consecutive semesters</li>
          <li>Outstanding Student Award in Computer Science</li>
          <li>Final Year Project: "AI-Powered Web Application"</li>
        </ul>
      `
    },
    {
      title: 'Featured Projects',
      content: `
        <h2>🚀 Featured Projects</h2>
        <p>Here are some of my most notable projects that showcase my skills and passion for development.</p>
        
        <h2>🌐 E-Commerce Platform</h2>
        <p><strong>Technologies:</strong> React, Node.js, MongoDB, Stripe API</p>
        <p>A full-stack e-commerce solution with user authentication, product management, and payment processing. Features include real-time inventory updates and responsive design.</p>
        
        <h2>📱 Task Management App</h2>
        <p><strong>Technologies:</strong> React Native, Firebase, Redux</p>
        <p>Cross-platform mobile application for task and project management with real-time collaboration features and offline support.</p>
        
        <h2>🤖 AI Chatbot</h2>
        <p><strong>Technologies:</strong> Python, TensorFlow, Flask, WebSocket</p>
        <p>Intelligent chatbot using natural language processing to provide customer support and answer frequently asked questions.</p>
        
        <h2>📊 Data Visualization Dashboard</h2>
        <p><strong>Technologies:</strong> D3.js, Express.js, PostgreSQL</p>
        <p>Interactive dashboard for visualizing complex datasets with real-time updates and customizable charts and graphs.</p>
      `
    },
    {
      title: 'Achievements & Awards',
      content: `
        <h2>🏆 Achievements & Awards</h2>
        <p>Recognition for my contributions and dedication to software development and innovation.</p>
        
        <h2>🥇 Hackathon Winner</h2>
        <p><strong>Event:</strong> TechCrunch Hackathon 2023</p>
        <p><strong>Achievement:</strong> First Place - "Best Innovation Award"</p>
        <p>Developed a real-time collaboration tool for remote teams in just 48 hours using cutting-edge web technologies.</p>
        
        <h2>🌟 Employee of the Month</h2>
        <p><strong>Company:</strong> Tech Solutions Inc.</p>
        <p><strong>Date:</strong> March 2023</p>
        <p>Recognized for outstanding performance and leadership in delivering a critical project ahead of schedule.</p>
        
        <h2>📜 Open Source Contributor</h2>
        <p><strong>Project:</strong> React Community Libraries</p>
        <p>Active contributor to popular open-source projects with over 500+ commits and 50+ merged pull requests.</p>
        
        <h2>🎯 Certification Excellence</h2>
        <p>Completed multiple professional certifications with top scores, demonstrating commitment to continuous learning.</p>
      `
    },
    {
      title: 'Courses & Certifications',
      content: `
        <h2>📜 Courses & Certifications</h2>
        <p>Continuous learning through professional courses and industry-recognized certifications.</p>
        
        <h2>☁️ Cloud Certifications</h2>
        <ul>
          <li><strong>AWS Certified Solutions Architect</strong> - Amazon Web Services (2023)</li>
          <li><strong>Google Cloud Professional Developer</strong> - Google Cloud (2022)</li>
          <li><strong>Azure Fundamentals</strong> - Microsoft (2022)</li>
        </ul>
        
        <h2>💻 Programming & Development</h2>
        <ul>
          <li><strong>Full Stack Web Development</strong> - freeCodeCamp (2021)</li>
          <li><strong>React Advanced Patterns</strong> - Frontend Masters (2022)</li>
          <li><strong>Node.js Microservices</strong> - Pluralsight (2023)</li>
          <li><strong>Python for Data Science</strong> - Coursera (2022)</li>
        </ul>
        
        <h2>🔒 Security & Best Practices</h2>
        <ul>
          <li><strong>OWASP Security Fundamentals</strong> - OWASP (2022)</li>
          <li><strong>Secure Coding Practices</strong> - SANS (2023)</li>
        </ul>
      `
    },
    {
      title: 'Technical Skills',
      content: `
        <h2>⚡ Technical Skills</h2>
        <p>Comprehensive skill set covering frontend, backend, databases, and cloud technologies.</p>
        
        <h2>🌐 Frontend Development</h2>
        <ul>
          <li><strong>Languages:</strong> JavaScript (ES6+), TypeScript, HTML5, CSS3</li>
          <li><strong>Frameworks:</strong> React, Vue.js, Angular, Next.js</li>
          <li><strong>Styling:</strong> Sass, Styled Components, Tailwind CSS</li>
          <li><strong>Tools:</strong> Webpack, Vite, Babel, ESLint</li>
        </ul>
        
        <h2>🖥️ Backend Development</h2>
        <ul>
          <li><strong>Languages:</strong> Node.js, Python, Java, C#</li>
          <li><strong>Frameworks:</strong> Express.js, Django, Spring Boot, .NET Core</li>
          <li><strong>APIs:</strong> REST, GraphQL, WebSocket</li>
          <li><strong>Architecture:</strong> Microservices, Serverless, MVC</li>
        </ul>
        
        <h2>🗄️ Databases & Storage</h2>
        <ul>
          <li><strong>SQL:</strong> PostgreSQL, MySQL, SQL Server</li>
          <li><strong>NoSQL:</strong> MongoDB, Redis, DynamoDB</li>
          <li><strong>Cloud Storage:</strong> AWS S3, Google Cloud Storage</li>
        </ul>
      `
    },
    {
      title: 'Get In Touch',
      content: `
        <h2>📧 Get In Touch</h2>
        <p>I'm always interested in new opportunities and collaborations. Feel free to reach out!</p>
        
        <h2>📱 Contact Information</h2>
        <p><strong>📧 Email:</strong> <a href="mailto:ekantkapgate@gmail.com">ekantkapgate@gmail.com</a></p>
        <p><strong>📍 Location:</strong> San Jose, California, USA</p>
        <p><strong>💼 LinkedIn:</strong> <a href="https://www.linkedin.com/in/ekant-kapgate-494854167/" target="_blank">linkedin.com/in/ekant-kapgate-494854167/</a></p>
        <p><strong>🐙 GitHub:</strong> <a href="https://github.com/ekant1999" target="_blank">github.com/ekant1999</a></p>
        <p><strong>🐦 Twitter:</strong> <a href="https://twitter.com/ekant1999" target="_blank">@ekant1999</a></p>
        <p><strong>📷 Instagram:</strong> <a href="https://instagram.com/ekant1999" target="_blank">@ekant1999</a></p>
        
        <h2>💬 Let's Connect</h2>
        <p>Whether you have a project in mind, want to collaborate, or just want to chat about technology, I'd love to hear from you!</p>
        
        <h2>🚀 Available For</h2>
        <ul>
          <li>Full-time positions</li>
          <li>Freelance projects</li>
          <li>Open source contributions</li>
          <li>Technical consulting</li>
          <li>Mentoring and knowledge sharing</li>
        </ul>
      `
    }
  ];
  
  let currentIndex = 0;
  let slideshowInterval = null;
  let isActive = false;
  
  // Show mobile slideshow
  function showMobileSlideshow() {
    console.log('Starting mobile slideshow...', 'isMobile:', isMobile(), 'isActive:', isActive);
    isActive = true;
    currentIndex = 0;
    
    // Hide main content
    $('.container').addClass('windows-open');
    
    // Show slideshow
    $('#mobileSlideshow').show();
    
    // Load first section
    loadSection(0);
    
    // Start auto-advance every 6 seconds
    slideshowInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % sections.length;
      loadSection(currentIndex);
    }, 6000);
  }
  
  // Hide mobile slideshow
  function hideMobileSlideshow() {
    console.log('Stopping mobile slideshow...');
    isActive = false;
    
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
    
    // Show main content
    $('.container').removeClass('windows-open');
    
    // Hide slideshow
    $('#mobileSlideshow').hide();
  }
  
  // Load specific section
  function loadSection(index) {
    if (index < 0 || index >= sections.length) return;
    
    const section = sections[index];
    currentIndex = index;
    
    // Update title and content
    $('#mobileTitle').text(section.title);
    $('#mobileContent').html(section.content);
    
    // Update counter
    $('#mobileCounter').text(`${index + 1} / ${sections.length}`);
  }
  
  // Handle window resize
  $(window).on('resize', function() {
    if (isMobile()) {
      if (!isActive) {
        showMobileSlideshow();
      }
    } else {
      hideMobileSlideshow();
    }
  });
  
  // Initialize on page load
  $(document).ready(function() {
    console.log('Initializing mobile slideshow...');
    console.log('Window width:', window.innerWidth);
    console.log('Is mobile:', isMobile());
    
    if (isMobile()) {
      // Start slideshow immediately
      showMobileSlideshow();
    } else {
      // On desktop, make sure slideshow is hidden
      $('#mobileSlideshow').hide();
    }
  });
  
  // Also try to start on window load
  $(window).on('load', function() {
    console.log('Window loaded, checking mobile...');
    if (isMobile() && !isActive) {
      showMobileSlideshow();
    }
  });
  
  // Test button handler
  $('#testSlideshow').on('click', function() {
    console.log('Test button clicked!');
    loadSection(0);
    alert('Test button works! Current section: ' + (currentIndex + 1));
  });
}

// Mobile Menu Toggle
function initializeMobileMenu() {
  function isMobile() {
    return window.innerWidth <= 768;
  }
  
  // Show/hide mobile menu button based on screen size
  function toggleMobileMenuButton() {
    const menuBtn = $('#mobileMenuBtn');
    if (isMobile()) {
      menuBtn.show();
    } else {
      menuBtn.hide();
      $('.sidebar').removeClass('open');
    }
  }
  
  // Handle mobile menu button click
  $('#mobileMenuBtn').on('click', function() {
    $('.sidebar').toggleClass('open');
  });
  
  // Handle window resize
  $(window).on('resize', function() {
    toggleMobileMenuButton();
  });
  
  // Initialize on load
  toggleMobileMenuButton();
}

``