// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Create YouTube players after the API code downloads.
var player1, player2;
function onYouTubeIframeAPIReady() {
    // Check if the element with id "player" exists
    if (document.getElementById('player')) {
        player1 = new YT.Player('player', {
            videoId: 'NLRUTUusD00',  // YouTube Video ID for player
            playerVars: {
                'autoplay': 1,
                'mute': 1,
                'controls': 0,
                'start': 52,
                'modestbranding': 1,  // Minimizes YouTube branding
                'rel': 0,             // No related videos at the end
                'iv_load_policy': 3,  // Hides annotations
                'playsinline': 1      // Plays the video inline (useful for mobile views)
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    // Check if the element with id "player-services" exists
    if (document.getElementById('player-services')) {
        player2 = new YT.Player('player-services', {
            videoId: 'RPJ2yvkQLMA',  // Different YouTube Video ID for player-services
            playerVars: {
                'autoplay': 1,
                'mute': 1,
                'controls': 0,
                'start': 520,          // Start at 520 seconds
                'modestbranding': 1,   // Minimizes YouTube branding
                'rel': 0,              // No related videos at the end
                'iv_load_policy': 3,   // Hides annotations
                'playsinline': 1       // Plays the video inline (useful for mobile views)
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerServicesStateChange // Separate event handler for looping
            }
        });
    }
}

// Play the video when the player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// Loop the video between 52s and 71s for player1.
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var loopStart = 52; // Loop start time in seconds
        var loopEnd = 71;   // Loop end time in seconds

        // Check the video time and loop if necessary
        var loopChecker = setInterval(function() {
            var currentTime = event.target.getCurrentTime();
            if (currentTime >= loopEnd) {
                event.target.seekTo(loopStart); // Jump back to the start of the loop
            }
        }, 1000); // Check every second

        // Clear the interval when the video is not playing
        event.target.addEventListener('onStateChange', function(evt) {
            if (evt.data != YT.PlayerState.PLAYING) {
                clearInterval(loopChecker);
            }
        });
    }
}

// Loop the video between 520s and 538s for player2.
function onPlayerServicesStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        var loopStart = 520; // Loop start time in seconds
        var loopEnd = 538;   // Loop end time in seconds

        // Check the video time and loop if necessary
        var loopChecker = setInterval(function() {
            var currentTime = event.target.getCurrentTime();
            if (currentTime >= loopEnd) {
                event.target.seekTo(loopStart); // Jump back to the start of the loop
            }
        }, 1000); // Check every second

        // Clear the interval when the video is not playing
        event.target.addEventListener('onStateChange', function(evt) {
            if (evt.data != YT.PlayerState.PLAYING) {
                clearInterval(loopChecker);
            }
        });
    }
}

// Filter function for the portfolio videos
function filterVideos(type) {
    let videos = document.querySelectorAll('.video-card');

    videos.forEach(video => {
        if (type === 'all') {
            video.style.display = 'block';
        } else if (video.classList.contains(type)) {
            video.style.display = 'block';
        } else {
            video.style.display = 'none';
        }
    });
}

// Function to play meow sound
function playMeowSound() {
    var meowSound = new Audio('audio/mrao.wav'); // Adjust the path as needed
    meowSound.play();
}

// Smooth scrolling function
function smoothScroll(target, duration) {
    var targetElement = document.querySelector(target);
    if (targetElement) {
        var targetPosition = targetElement.getBoundingClientRect().top;
        var startPosition = window.pageYOffset;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, startPosition, targetPosition, duration);
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
}

// Add event listeners for smooth scrolling on navigation links
document.addEventListener('DOMContentLoaded', function() {
    var meowButton = document.getElementById('meowButton');
    if (meowButton) {
        meowButton.addEventListener('click', playMeowSound);
    }

    // Add smooth scrolling to navigation links
    var navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            var target = this.getAttribute('href');
            smoothScroll(target, 1000); // Adjust duration (in milliseconds) as needed
        });
    });
});

//Event listener to fade out main welcome text
window.addEventListener('DOMContentLoaded', (event) => {
    const fadeText = document.getElementById('fade-text');
    fadeText.classList.add('fade-out');
});

//Default & Gmail Mail Calls for sending forms
function submitForm(event) {
event.preventDefault();  // Prevent the default form submission

// Get form field values
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const message = document.getElementById('message').value;

// Create the mailto link with pre-filled values
const mailtoLink = `mailto:mraomedia@gmail.com?subject=Contact from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage: ${message}`;

// Open the user's default email client with the mailto link
window.location.href = mailtoLink;
}

function sendViaGmail() {
// Get form field values
const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const message = document.getElementById('message').value;

// Create the Gmail URL with pre-filled values
const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=mraomedia@gmail.com&su=Contact from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage: ${message}`;

// Open Gmail web app in a new tab
window.open(gmailLink, '_blank');
}

// Function to load the header
function loadHeader() {
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-section').innerHTML = data;
    })
    .catch(error => console.error('Error loading the header:', error));
}

// Function to load the index header
function loadIndexHeader() {
  fetch('index-header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-section').innerHTML = data;
    })
    .catch(error => console.error('Error loading the header:', error));
}

// Function to load the contact form
function loadContactForm() {
  fetch('contact-form.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('contact-section').innerHTML = data;
    })
    .catch(error => console.error('Error loading the contact form:', error));
}

// Function to load the review form
function loadReviewForm() {
  fetch('review-form.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('review-section').innerHTML = data;
    })
    .catch(error => console.error('Error loading the review form:', error));
}

// Function to load the footer
function loadFooter() {
  fetch('footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-section').innerHTML = data;
    })
    .catch(error => console.error('Error loading the footer:', error));
}

// Default email sending function
function submitReviewForm(event) {
    event.preventDefault();  // Prevent the default form submission

    // Get form field values
    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="rating"]:checked') ? document.querySelector('input[name="rating"]:checked').value : "No rating";
    const message = document.getElementById('message').value;

    // Create the mailto link with pre-filled values, excluding the email field
    const mailtoLink = `mailto:mraomedia@gmail.com?subject=Movie Review from ${name}&body=Name: ${name}%0D%0ARating: ${rating}%0D%0AMovie Review: ${message}`;

    // Open the user's default email client with the mailto link
    window.location.href = mailtoLink;
}

// Send via Gmail function
function sendReviewViaGmail() {
    // Get form field values
    const name = document.getElementById('name').value;
    const rating = document.querySelector('input[name="rating"]:checked') ? document.querySelector('input[name="rating"]:checked').value : "No rating";
    const message = document.getElementById('message').value;

    // Create the Gmail URL with pre-filled values, excluding the email field
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=mraomedia@gmail.com&su=Movie Review from ${name}&body=Name: ${name}%0D%0ARating: ${rating}%0D%0AMovie Review: ${message}`;

    // Open Gmail web app in a new tab
    window.open(gmailLink, '_blank');
}
