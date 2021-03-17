# Tenant Content

Content (copy, metadata, etc) for a Tenant is provided in code as a JavaScript object, one per tenant. This object determines what Narratives, Metrics, etc., will be included for that Tenant; e.g., a Metric without content will be excluded from the site even if the data is available, and conversely, a Metric with content will be included even if the data is not available (which will cause errors to be reported in the UI).

For more information on what this object should contain, refer to [the type definitions](./types.ts).

## Copy can contain HTML

You can write any HTML you like in a copy string (e.g., the introduction to a narrative, or a section body) and the tags will be rendered to the page. Not all of them will necessarily have useful styles applied to them, but you can always make a feature request to add anything unsupported. Notably:

- `p`, `a`, and `ul`/`li` tags should do pretty much what you expect
- You can style footnotes! Put the marker in a `sup` tag and the footnote text in an `aside`. (This basically just changes the text size, it doesn't add any special functionality.)
- In multi-column text (e.g., the final Racial Disparities section), wrapping text in a `div` will create a column break after it (and also _prevent_ column breaks within it)

This HTML is not sanitized in any way (it's considered trusted, since it's checked into version control) so be careful!

## Dynamic text expansion in Narratives

Some Narratives support (indeed, require) dynamic text expansion, through a very simple template syntax provided by [Pupa](https://github.com/sindresorhus/pupa#readme). TL;DR: put variable names in `{braces}`!

For a given Narrative, the application will supply the data needed to plug into your templates when it renders the page. See below for documentation of what variables will be available:

### Racial Disparities

Variables reflect the currently selected racial/ethnic group unless otherwise specified. All percentages are rounded to the nearest whole number. Use dot notation to reference nested variables (e.g. `beforeCorrections.populationPctCurrent`)

- **ethnonym**: name of the selected racial/ethnic group, e.g., "people who are Native American".
- **ethnonymCapitalized**: same but "People" is capitalized.
- **supervisionType**: "supervision", "parole", or "probation", per supervision type filter
- **likelihoodVsWhite**: for each group listed, the relative likelihood of its members being justice-involved compared to white people. Rounded to the nearest tenth.
  - **BLACK**
  - **HISPANIC**
  - **AMERICAN_INDIAN_ALASKAN_NATIVE**
- **beforeCorrections**:
  - **populationPctCurrent**: % of the statewide population
  - **correctionsPctCurrent**: % of the justice-involved population
- **releasesToParole**:
  - **paroleReleaseProportion36Mo**: % of all parole grants over the past 3 years
  - **prisonPopulationProportion36Mo**: % of total prison population over the past 3 years
- **programming**:
  - **participantProportionCurrent**: % of total program participants
  - **supervisionProportionCurrent**: % of total supervised population
  - **comparison**: natural-language comparison of the former to the latter; will be "greater", "smaller", or "similar"
- **sentencing**:
  - **incarcerationPctCurrent**: % currently serving incarceration sentences
  - **probationPctCurrent**: % currently serving probation sentences
  - **overall**: these values reflect the **total** justice-involved population, not just the selected racial/ethnic group
    - **incarcerationPctCurrent**
    - **probationPctCurrent**
  - **comparison**: natural-language comparison of the selected group's incarceration % to the overall incarceration %; will be "greater", "smaller", or "similar"
- **supervision**: all values reflect the active Supervision Type filter (parole, probation, or both)
  - **revocationProportion36Mo**: % of total revocations over the past 3 years
  - **populationProportion36Mo**: % of total supervised population over the past 3 years
  - **absconsionProportion36Mo**: % of revocations over the past 3 years due to absconsion.
  - **newCrimeProportion36Mo**: same but for new offenses
  - **technicalProportion36Mo**: same but for technicals
  - **unknownProportion36Mo**: same but for unknowns
  - **overall**: these values reflect the **total** supervised population, not just the selected racial/ethnic group
    - **absconsionProportion36Mo**
    - **newCrimeProportion36Mo**
    - **technicalProportion36Mo**
    - **unknownProportion36Mo**
