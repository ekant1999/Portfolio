$(function() {
  
    $('.prompt').html('root@Fiction:~/home/ekant$ ');

  var term = new Terminal('#input-line .cmdline', '.card-body output');
  term.init();
  
});

var util = util || {};
util.toArray = function(list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function(cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    'whoami', 'education', 'security', 'programming', 'interests', 'love', 'media' ,'contact', 'clear', 'help' ,'date','oops'
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
          return;
        case 'help':
          var result = "<h3>Help</h3><p><b>whoami</b>:Show personal info<br><b>education</b>: show education TimeLine<br><b>programming</b>: show programming achivements<br><b>interests</b>: Display my interests<br><b>contact</b>: Say hi<br><b>clear</b>: clear terminal output<br><b>oops</b>: Oops<br><b>help</b>: Show help menu</p>";
          output(result);
          break;
        case 'education':
          var result = "<h3>Education:</h3>"+"<p><h3>Major</h3>Bachelor of Technology in computer science and engineering </br>at SGGSIE&T in Nanded, Maharshtra.<br><p>Studied 5th semester at College of engineering Pune</p><br>";
          output(result);
          break;
        case 'interests': 
          var result = "<h3>Interests</h3><p>Machine  Learning , deep learning , AI, Algorithms,</br>Data Structures, Problem Solving, Reading,</br>Open Source Technologies...&#128151;</p>";
          output(result);
          break;
        case 'contact':
          var result = "<h3>Contact</h3><b>Email</b>: <a href=\"mailto:2016bcs105@sggs.ac.in\" >2016bcs105@sggs.ac.in</a> </br><b>Instagram</b>: ekant1999<br><b>linkedin</b>: <a href=\"https://www.linkedin.com/in/ekant-kapgate-494854167/\">linkedin.com/in/ekant-kapgate-494854167/</a><br><b>Github</b>: <a href=\"https://github.com/ekant1999\">github.com/ekant1999</a>";
          output(result);

          break;
        case 'whoami':
          var result = "<h2>Ekant kapgate</h2><p>loves to code , ML DL enthusiast <span >&#128513;</span>   </p><p>I am 21 years old. I am from Nagpur.</br>I am interested in  machine learning , deep learning,</br>algorithms, data structures.</br>I love sharing code, love, and knowledge.</br>I like to meet new people, and to discover new cultures.</br> </p>"
          output(result);
           
          break;
          case 'date':
            var result=new Date().toString();
           output(result);
           break;
            case 'oops':
            var result="<p> Did I do that</p>"
           output(result);
          hinge($("#terminal"));
           break;
        default:
          if (cmd) {
            output(cmd + ': command not found');
          }
      };

      window.scrollTo(0, getDocHeight_());
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
      output('<p>-- Terminal was built with lot of JavaScript and love &#10084;&#65039;</p><p> -- Type \'help\' command for more information.</p>');
    },
    output: output
  }
};


$(document).on('keypress',function(e) {
    if(e.which == 13) {
        var elem = document.getElementsByClassName("card-body")[0];
  elem.focus();
  elem.scrollTop = elem.scrollHeight;
    }
});
var cursorFocus = function(elem) {
  var x = window.scrollX, y = window.scrollY;
  window.scrollTo(x, y);
}
cursorFocus(document.getElementById('card-body'));

function hinge(thing) {
  $(thing).addClass('animated hinge');
  $(thing).on('animationend mozanimationend webkitAnimationEnd oAnimationEnd msanimationend', function() {
    $(thing).remove();
  });
}

