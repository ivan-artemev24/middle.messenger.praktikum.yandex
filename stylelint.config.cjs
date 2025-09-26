module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['nest'],
      },
    ],
    // Allow BEM-style class names (block__element--modifier)
    'selector-class-pattern': [
      '^[a-z0-9]+(?:-[a-z0-9]+)*(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$',
      { resolveNestedSelectors: true },
    ],
    // Keep existing hex formats as written (e.g., #FFFFFF)
    'color-hex-length': 'long',
    // Allow legacy color functions like rgba()
    'color-function-notation': 'legacy',
    // Use numeric alpha (e.g., 0.5) instead of percentages
    'alpha-value-notation': 'number',
    // Relax whitespace and ordering constraints to match current codebase
    'rule-empty-line-before': null,
    'no-duplicate-selectors': null,
    'no-descending-specificity': null,
    // Allow zero units and redundant shorthands as-is
    'length-zero-no-unit': null,
    'shorthand-property-no-redundant-values': null,
    // Do not enforce quotes around font family names
    'font-family-name-quotes': null,
  },
};
