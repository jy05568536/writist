import { mermaidAPI } from 'mermaid'

mermaidAPI.initialize({
  gantt: {
    axisFormatter: [
      ['%Y-%m-%d', (d) => {
        return d.getDay() === 1
      }]
    ]
  }
})

const mermaidChart = (code, line) => {
  try {
    mermaidAPI.parse(code)
    let id = Math.round(Math.random() * 10000)
    return '<div class="mermaid source-line" data-source-line="' + line + '">' + mermaidAPI.render('mermaid' + id, code) + '</div>'
  } catch ({str, hash}) {
    return `<pre>${str}</pre>`
  }
}

const MermaidPlugin = (md) => {
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)
  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    const code = token.content.trim()
    if (token.info === 'mermaid') {
      let line
      if (tokens[idx].map) {
        line = tokens[idx].map[0] + 1
      }
      return mermaidChart(code, line)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export default MermaidPlugin
