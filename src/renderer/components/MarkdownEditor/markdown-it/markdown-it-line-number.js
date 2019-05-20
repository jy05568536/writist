const injectLineNumbers = (tokens, idx, options, env, slf) => {
  let line
  // if (tokens[idx].map && tokens[idx].level === 0) {
  if (tokens[idx].map) {
    line = tokens[idx].map[0]
    tokens[idx].attrJoin('class', 'source-line')
    tokens[idx].attrSet('data-source-line', line + 1)
  }
  return slf.renderToken(tokens, idx, options, env, slf)
}

const LineNumberPlugin = (md) => {
  md.renderer.rules.paragraph_open = injectLineNumbers
  md.renderer.rules.heading_open = injectLineNumbers
  md.renderer.rules.list_item_open = injectLineNumbers
  md.renderer.rules.table_open = injectLineNumbers
  // md.renderer.rules.container_success_open = injectLineNumbers
  // md.renderer.rules.container_info_open = injectLineNumbers
  // md.renderer.rules.container_warning_open = injectLineNumbers
  // md.renderer.rules.container_danger_open = injectLineNumbers
  // md.renderer.rules.fence = injectLineNumbers
}

export default LineNumberPlugin
