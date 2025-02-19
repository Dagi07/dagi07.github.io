// Front-end JavaScript
async function fetchContributions() {
    try {
      const response = await fetch('https://github-contributions-proxy.vercel.app/api/fetch-contributions');
      if (!response.ok) {
        throw new Error(`Error fetching contributions: ${response.statusText}`);
      }
      const contributions = await response.json();
      // Process and display the contributions data as needed
      contributions.weeks.forEach(week => {
            week.contributionDays.forEach(day => {
                const dayElement = document.createElement('div');
                dayElement.className = 'day';
                dayElement.style.backgroundColor = day.color;
                dayElement.title = `${day.date}: ${day.contributionCount} contributions`;
                graphContainer.appendChild(dayElement);
            });
        });
      console.log(contributions);
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    }
  }
  
  fetchContributions();
  