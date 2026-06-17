/* terminal.js */

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.querySelector('.terminal-body');
  const terminalOutput = document.querySelector('.terminal-output');
  const inputForm = document.querySelector('.terminal-input-form');
  const terminalInput = document.querySelector('.terminal-input');
  
  const startTime = Date.now();
  
  // Keep input focused when clicking inside terminal body
  terminalBody.addEventListener('click', () => {
    terminalInput.focus();
  });
  
  // Commands database
  const commands = {
    help: () => `Available commands:
  about        - Who I am and what I do
  skills       - Technical skill matrix
  projects     - Highlighted projects
  experience   - Internship & work experience
  education    - Academic background
  certs        - Certifications & workshops
  socials      - Connect with me online
  theme        - Change theme. Usage: theme [slate|cyberpunk|light]
  neofetch     - System overview with ASCII logo
  clear        - Clear terminal history`,
    
    about: () => `ABDUL RAZAQE VALLIPPADAN
------------------------------------------------
Motivated BCA student with strong skills in cybersecurity,
network analysis, and web development. Proficient in Java,
Python, and SQL, with hands-on experience in ethical hacking
tools like Metasploit and OWASP ZAP. Passionate about
securing systems and contributing to IT infrastructure
and cybersecurity roles.

Location:  Bangalore, India
Email:     abdulrazaqevp@gmail.com
Phone:     +91 9946219247`,
    
    skills: () => `TECHNICAL SKILL MATRIX
------------------------------------------------
[Languages]    C++, Java, Python, SQL, HTML, CSS, JavaScript
[Security]     Metasploit, OWASP ZAP, Kali Linux, TCP Dump
[Web Stack]    React, Node.js, Express.js, MongoDB
[OS]           Windows, Linux (basics)
[Soft Skills]  Communication, Team Collaboration,
               Problem Solving, Time Management`,
    
    projects: () => `SELECTED PROJECTS
------------------------------------------------
1. RFID Access Control System with Logging
   > Real-time entry/exit logging & database-backed
     user authentication using RFID technology.

2. Smart Resume Builder Web Application
   > Full-stack app for ATS-optimized resumes.
     React frontend, Node.js/Express/MongoDB backend.
     Multiple templates, PDF/DOCX export.`,
    
    experience: () => `INTERNSHIP EXPERIENCE
------------------------------------------------
1. Cyber Security Intern | Elevate Labs
   Aug 2025 - Sep 2025 (45 days) & Jan 2026 - Sep 2026
   > Vulnerability assessments, threat analysis,
     enhanced system security & data protection.

2. Web Developer Intern | Elevate Labs
   Nov 2025 - Dec 2025 (45 days)
   > Front-end design, responsive layouts,
     debugging web applications.

3. Python Developer Intern | Quest Innovative Solutions
   Feb 2026 - Apr 2026 (2 Months)
   > Developed & tested Python-based apps and scripts.`,
    
    education: () => `EDUCATION
------------------------------------------------
BCA in Cyber Security, Ethical Hacking & Cloud Computing
Yenepoya Deemed to be University, Bangalore
2023 - Present

Vocational Higher Secondary Education
SHMGVHSS, Edavanna, Malappuram
2021 - 2023`,
    
    certs: () => `CERTIFICATIONS & WORKSHOPS
------------------------------------------------
[Certifications]
• Junior Software Developer - Keltron
• Cybersecurity Attack & Defense - EC Council (Coursera)
• Web App Security Testing with OWASP ZAP (Coursera)
• Metasploit: Ethical Penetration Testing (Coursera)
• Network Traffic Analysis with TCP Dump (Coursera)

[Workshops]
• Ethical Hacking Basics using Kali Linux
• Cloud Security Workshop (Introductory)`,
    
    socials: () => `CONNECT WITH ME
------------------------------------------------
LinkedIn - linkedin.com/in/abdulrazaqe
Email    - abdulrazaqevp@gmail.com
Phone    - +91 9946219247`,
    
    neofetch: () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'slate';
      const uptimeSec = Math.floor((Date.now() - startTime) / 1000);
      
      return `    _    ____  ____  _   _ _     
   / \\  | __ )|  _ \\| | | | |    
  / _ \\ |  _ \\| | | | | | | |    
 / ___ \\| |_) | |_| | |_| | |___ 
/_/   \\_\\____/|____/ \\___/|_____|
      
Owner:    Abdul Razaqe Vallippadan
Role:     BCA Student | Cybersecurity & Web Dev
OS:       Antigravity WebOS
Shell:    Abdul.R CLI v1.0.0
Theme:    ${activeTheme.toUpperCase()}
Uptime:   ${uptimeSec} seconds
Location: Bangalore, India
Status:   Open for internships & opportunities!`;
    },
    
    contact: () => `GET IN TOUCH
------------------------------------------------
Email:    abdulrazaqevp@gmail.com
Phone:    +91 9946219247
Location: Bangalore, India
Form:     Scroll down to the contact section!
Status:   Available for internships & full-time roles.`
  };
  
  // Execute command function
  const executeCommand = (cmdText) => {
    const trimmed = cmdText.trim();
    if (!trimmed) return;
    
    const parts = trimmed.split(/\s+/);
    const primaryCmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Add command to log
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line command-line';
    cmdLine.innerHTML = `
      <span class="terminal-prompt">visitor@abdulrazaqe:~$</span>
      <span class="terminal-prompt-arrow">></span>
      <span>${trimmed}</span>
    `;
    terminalOutput.appendChild(cmdLine);
    
    // Process response
    let responseText = '';
    let isError = false;
    
    if (primaryCmd === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    } else if (primaryCmd === 'theme') {
      if (args.length === 0) {
        responseText = `Usage: theme [slate|cyberpunk|light]\nCurrent theme: ${document.documentElement.getAttribute('data-theme') || 'slate'}`;
      } else {
        const selectedTheme = args[0].toLowerCase();
        if (['slate', 'cyberpunk', 'light'].includes(selectedTheme)) {
          const btn = document.querySelector(`.theme-btn[data-theme="${selectedTheme}"]`);
          if (btn) {
            btn.click();
            responseText = `Theme successfully switched to: ${selectedTheme.toUpperCase()}`;
          } else {
            responseText = `Error switching theme.`;
            isError = true;
          }
        } else {
          responseText = `Unknown theme: '${selectedTheme}'. Choose slate, cyberpunk, or light.`;
          isError = true;
        }
      }
    } else if (commands[primaryCmd]) {
      responseText = commands[primaryCmd]();
    } else {
      responseText = `shell: command not found: ${primaryCmd}. Type 'help' for suggestions.`;
      isError = true;
    }
    
    // Append response to output
    if (responseText) {
      const responseLine = document.createElement('div');
      responseLine.className = `terminal-response ${isError ? 'error' : ''}`;
      responseLine.textContent = responseText;
      terminalOutput.appendChild(responseLine);
    }
    
    // Auto Scroll to bottom
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };
  
  // Handle form submission
  inputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cmd = terminalInput.value;
    terminalInput.value = '';
    executeCommand(cmd);
  });
});
