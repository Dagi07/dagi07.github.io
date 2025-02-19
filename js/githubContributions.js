// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
// const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

// // var to = new Date();
// // var year  = to.getFullYear();
// // var month = to.getMonth();
// // var day   = to.getDate();
// // var from = new Date(year - 1, month, day);

// // async function fetchGitHubContributions() {
// //     const query = `
// //     {
// //       user(login: "${GITHUB_USERNAME}") {
// //         contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
// //           contributionCalendar {
// //             totalContributions
// //             weeks {
// //               contributionDays {
// //                 date
// //                 contributionCount
// //                 color
// //               }
// //             }
// //           }
// //         }
// //       }
// //     }`;

// //     const response = await fetch('https://api.github.com/graphql', {
// //         method: 'POST',
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${GITHUB_TOKEN}`,
// //         },
// //         body: JSON.stringify({ query }),
// //     });

// //     const data = await response.json();
// //     return data.data.user.contributionsCollection.contributionCalendar;
// // }

// // fetchGitHubContributions().then(contributions => {
// //     console.log('Total Contributions:', contributions.totalContributions);
// //     renderContributionGraph(contributions);
// // });

// // function renderContributionGraph(contributions) {
// //     const graphContainer = document.getElementById('contribution-graph');
// //     graphContainer.innerHTML = ''; // Clear existing content

// //     contributions.weeks.forEach(week => {
// //         week.contributionDays.forEach(day => {
// //             const dayElement = document.createElement('div');
// //             dayElement.className = 'day';
// //             dayElement.style.backgroundColor = day.color;
// //             dayElement.title = `${day.date}: ${day.contributionCount} contributions`;
// //             graphContainer.appendChild(dayElement);
// //         });
// //     });
// // }

// // Handle preflight requests
// if (req.method === 'OPTIONS') {
//   res.status(200).end();
//   return;
// }


// // GraphQL query to fetch contribution years
// const yearsQuery = `
//   query {
//     user(login: "${GITHUB_USERNAME}") {
//       contributionsCollection {
//         contributionYears
//       }
//     }
//   }
// `;

// try {
//   const yearsResponse = await fetch('https://api.github.com/graphql', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${GITHUB_TOKEN}`,
//     },
//     body: JSON.stringify({ query: yearsQuery }),
//   });

//   if (!yearsResponse.ok) {
//     throw new Error(`GitHub API responded with status ${yearsResponse.status}`);
//   }

//   const yearsData = await yearsResponse.json();
//   const contributionYears = yearsData.data.user.contributionsCollection.contributionYears;

//   // Fetch contributions for each year
//   const contributionsByYear = {};
//   for (const year of contributionYears) {
//     const from = `${year}-01-01T00:00:00Z`;
//     const to = `${year}-12-31T23:59:59Z`;

//     const contributionsQuery = `
//       query {
//         user(login: "${GITHUB_USERNAME}") {
//           contributionsCollection(from: "${from}", to: "${to}") {
//             contributionCalendar {
//               totalContributions
//               weeks {
//                 contributionDays {
//                   date
//                   contributionCount
//                   color
//                 }
//               }
//             }
//           }
//         }
//       }
//     `;

//     const contributionsResponse = await fetch('https://api.github.com/graphql', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${GITHUB_TOKEN}`,
//       },
//       body: JSON.stringify({ query: contributionsQuery }),
//     });

//     if (!contributionsResponse.ok) {
//       throw new Error(`GitHub API responded with status ${contributionsResponse.status}`);
//     }

//     const contributionsData = await contributionsResponse.json();
//     contributionsByYear[year] = contributionsData.data.user.contributionsCollection.contributionCalendar;
//   }

//   res.status(200).json(contributionsByYear);
// } catch (error) {
//   res.status(500).json({ error: error.message });
// }


async function fetchGitHubContributions() {
  
  var requirejs = require('requirejs');
  requirejs.config({
  //Pass the top-level main.js/index.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});
requirejs(['foo', 'bar'],
  function   (foo,   bar) {
      //foo and bar are loaded according to requirejs
      //config, but if not found, then node's require
      //is used to load the module.
  });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;

  const yearsQuery = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection {
          contributionYears
        }
      }
    }
  `;

  try {
    const yearsResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
      },
      body: JSON.stringify({ query: yearsQuery }),
    });

    if (!yearsResponse.ok) {
      throw new Error(`GitHub API responded with status ${yearsResponse.status}`);
    }

    const yearsData = await yearsResponse.json();
    const contributionYears = yearsData.data.user.contributionsCollection.contributionYears;

    // Fetch contributions for each year
    const contributionsByYear = {};
    for (const year of contributionYears) {
      const from = `${year}-01-01T00:00:00Z`;
      const to = `${year}-12-31T23:59:59Z`;

      const contributionsQuery = `
        query {
          user(login: "${GITHUB_USERNAME}") {
            contributionsCollection(from: "${from}", to: "${to}") {
              contributionCalendar {
                weeks {
                  contributionDays {
                    date
                    contributionCount
                  }
                }
              }
            }
          }
        }
      `;

      const contributionsResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({ query: contributionsQuery }),
      });

      if (!contributionsResponse.ok) {
        throw new Error(`GitHub API responded with status ${contributionsResponse.status}`);
      }

      const contributionsData = await contributionsResponse.json();
      const weeks = contributionsData.data.user.contributionsCollection.contributionCalendar.weeks;
      
      // Flatten data into an array of { date, contributionCount }
      contributionsByYear[year] = weeks.flatMap(week => week.contributionDays);
    }

    return contributionsByYear;
  } catch (error) {
    console.error("Error fetching contributions:", error);
    return null;
  }
}
