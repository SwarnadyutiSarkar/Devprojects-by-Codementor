// Set up the SVG
const width = 800;
const height = 600;
const svg = d3.select('#globe-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Set up the projection
const projection = d3.geoMercator()
  .center([0, 0])
  .scale(150)
  .translate([width / 2, height / 2]);

// Set up the path generator
const path = d3.geoPath()
  .projection(projection);

// Load the country data
d3.json('countries.json', (error, data) => {
  if (error) throw error;

  // Create a feature for each country
  const countries = data.features;

  // Create a map of country names to ISO codes
  const countryCodes = {};
  countries.forEach((country) => {
    countryCodes[country.properties.name] = country.properties.iso_a2;
  });

  // Draw the globe
  const globe = svg.append('g')
    .attr('class', 'globe');

  globe.selectAll('path')
    .data(countries)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', (d) => `country ${d.properties.continent}`);

  // Add country labels
  globe.selectAll('text')
    .data(countries)
    .enter()
    .append('text')
    .attr('x', (d) => projection([d.properties.longitude, d.properties.latitude])[0])
    .attr('y', (d) => projection([d.properties.longitude, d.properties.latitude])[1])
    .text((d) => d.properties.name);

  // Add event listener to country select
  d3.select('#country-select').on('change', () => {
    const selectedCountry = d3.select('#country-select').property('value');
    const countryCode = countryCodes[selectedCountry];
    const country = countries.find((c) => c.properties.iso_a2 === countryCode);

    // Rotate the globe to center on the selected country
    const targetRotation = [country.properties.longitude, country.properties.latitude];
    globe.transition()
      .duration(2000)
      .attrTween('transform', () => {
        const r = d3.interpolate(projection.rotate(), targetRotation);
        return (t) => `rotate(${r(t)[0]} ${r(t)[1]})`;
      });

    // Highlight the continent
    globe.selectAll(`.country.${country.properties.continent}`)
      .classed('highlight', true);

    // Display country names in the same continent
    const continentCountries = countries.filter((c) => c.properties.continent === country.properties.continent);
    globe.selectAll('text')
      .data(continentCountries)
      .text((d) => d.properties.name);
  });
});