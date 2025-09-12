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
          var result = "<h3>Education:</h3>"+"<p><h4>Major</h4>Bachelor of Technology in Computer Science and Engineering</br>at SGGSIE&T in Nanded, Maharashtra.<br><p>Studied 5th semester at College of Engineering Pune</p><br>";
          output(result);
          break;
        case 'interests': 
          var result = "<h3>Interests</h3><p>Machine Learning, Deep Learning, AI, Algorithms,</br>Data Structures, Problem Solving, Reading,</br>Open Source Technologies...&#128151;</p>";
          output(result);
          break;
        case 'contact':
          var result = "<h3>Contact</h3><b>Email</b>: <a href=\"mailto:2016bcs105@sggs.ac.in\" >2016bcs105@sggs.ac.in</a> </br><b>Instagram</b>: ekant1999<br><b>linkedin</b>: <a href=\"https://www.linkedin.com/in/ekant-kapgate-494854167/\">linkedin.com/in/ekant-kapgate-494854167/</a><br><b>Github</b>: <a href=\"https://github.com/ekant1999\">github.com/ekant1999</a>";
          output(result);

          break;
        case 'whoami':
          var result = "<h2>Ekant Kapgate</h2><p>Loves to code, ML & DL enthusiast <span >&#128513;</span></p><p>I am a passionate developer from Nagpur.</br>I am interested in machine learning, deep learning,</br>algorithms, and data structures.</br>I love sharing code, knowledge, and experiences.</br>I enjoy meeting new people and discovering new cultures.</br></p>"
          output(result);
           
          break;
        case 'programming':
          var result = "<h3>Programming Skills</h3><p><b>Languages:</b> Python, JavaScript, Java, C++</br><b>Frameworks:</b> React, Node.js, Django</br><b>Tools:</b> Git, Docker, AWS</br><b>Databases:</b> MySQL, MongoDB, PostgreSQL</br><b>ML/DL:</b> TensorFlow, PyTorch, Scikit-learn</p>";
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

function initializeWindowSystem() {
  // Handle icon clicks
  $('.icon').on('click', function() {
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
  
  // Check if window is already open
  if (openWindows[windowType]) {
    bringToFront(openWindows[windowType]);
    return;
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

function closeWindow(windowId) {
  const $window = $('#' + windowId);
  const windowType = $window.data('type');
  
  $window.fadeOut(300, function() {
    $(this).remove();
    delete openWindows[windowType];
  });
}

function minimizeWindow(windowId) {
  const $window = $('#' + windowId);
  const $content = $window.find('.window-content');
  
  if ($content.is(':visible')) {
    $content.slideUp(200);
  } else {
    $content.slideDown(200);
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
        <p>I am a passionate developer from Nagpur, India. I love to code and am enthusiastic about <strong>machine learning</strong>, <strong>deep learning</strong>, <strong>algorithms</strong>, and <strong>data structures</strong>.</p>
        <p>I enjoy sharing code, knowledge, and experiences. I love meeting new people and discovering new cultures. Currently pursuing my Bachelor's in Computer Science and Engineering.</p>
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:2016bcs105@sggs.ac.in">2016bcs105@sggs.ac.in</a></li>
          <li><strong>Location:</strong> Nagpur, Maharashtra, India</li>
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
        <h2>Software Developer Intern</h2>
        <h3>Tech Company | 2023 - Present</h3>
        <p>Working on machine learning projects and web development using Python, JavaScript, and various frameworks.</p>
        
        <h2>Open Source Contributor</h2>
        <h3>Various Projects | 2022 - Present</h3>
        <p>Contributing to open source projects, particularly in the machine learning and web development space.</p>
      `
    },
    education: {
      title: 'Education',
      content: `
        <h1>Educational Background</h1>
        <h2>Bachelor of Technology</h2>
        <h3>Computer Science and Engineering</h3>
        <p><strong>Institution:</strong> SGGSIE&T, Nanded, Maharashtra</p>
        <p><strong>Duration:</strong> 2016 - 2020</p>
        
        <h2>Semester Exchange</h2>
        <h3>5th Semester</h3>
        <p><strong>Institution:</strong> College of Engineering Pune</p>
        <p><strong>Duration:</strong> 2018</p>
      `
    },
    projects: {
      title: 'Projects',
      content: `
        <h1>My Projects</h1>
        <h2>Machine Learning Project</h2>
        <p>Advanced machine learning model for data analysis and prediction using Python and TensorFlow.</p>
        <p><strong>Technologies:</strong> Python, TensorFlow, Scikit-learn</p>
        
        <h2>Web Application</h2>
        <p>Full-stack web application built with React and Node.js for real-time data visualization.</p>
        <p><strong>Technologies:</strong> React, Node.js, MongoDB</p>
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
        <h2>Machine Learning Specialization</h2>
        <p><strong>Provider:</strong> Coursera</p>
        <p>Comprehensive course covering supervised and unsupervised learning algorithms</p>
        <p><strong>Year:</strong> 2023</p>
        
        <h2>Deep Learning Fundamentals</h2>
        <p><strong>Provider:</strong> edX</p>
        <p>Advanced course on neural networks and deep learning architectures</p>
        <p><strong>Year:</strong> 2023</p>
        
        <h2>Full Stack Web Development</h2>
        <p><strong>Provider:</strong> Udemy</p>
        <p>Complete web development course covering frontend and backend technologies</p>
        <p><strong>Year:</strong> 2022</p>
      `
    },
    skills: {
      title: 'Skills',
      content: `
        <h1>Technical Skills</h1>
        <h2>Programming Languages</h2>
        <p><code>Python</code> <code>JavaScript</code> <code>Java</code> <code>C++</code> <code>SQL</code></p>
        
        <h2>Frameworks & Libraries</h2>
        <p><code>React</code> <code>Node.js</code> <code>Django</code> <code>TensorFlow</code> <code>PyTorch</code></p>
        
        <h2>Tools & Technologies</h2>
        <p><code>Git</code> <code>Docker</code> <code>AWS</code> <code>MongoDB</code> <code>MySQL</code></p>
        
        <h2>Areas of Expertise</h2>
        <p><strong>Machine Learning</strong>, <strong>Deep Learning</strong>, <strong>Web Development</strong>, <strong>Data Structures</strong>, <strong>Algorithms</strong></p>
        
        <h3>Specializations</h3>
        <ul>
          <li>Neural Networks & Deep Learning</li>
          <li>Full-Stack Web Development</li>
          <li>Data Analysis & Visualization</li>
          <li>Cloud Computing & DevOps</li>
        </ul>
      `
    },
    contact: {
      title: 'Contact',
      content: `
        <h1>Get In Touch</h1>
        <p>I'm always interested in new opportunities and collaborations. Feel free to reach out!</p>
        
        <h2>Contact Information</h2>
        <p><strong>📧 Email:</strong> <a href="mailto:2016bcs105@sggs.ac.in">2016bcs105@sggs.ac.in</a></p>
        <p><strong>📍 Location:</strong> Nagpur, Maharashtra, India</p>
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

``